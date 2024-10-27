import { compare } from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import crypto from "crypto";
import passport from "passport";
import {
  sendSubscriptionEmail,
  sendVerificationMail,
  sendWelcomeEmail,
} from "../Emails/emails.js";
import { TryCatch } from "../Middlewares/error.js";
import { Item } from "../Models/Item.js";
import { Subscriber, User } from "../Models/user.js";
import {
  cookieOptions,
  generateTokenAndSetCookie,
  uploadFilesToCloudinary,
} from "../Utils/features.js";
import ErrorHandler from "../Utils/utility.js";

const signup = TryCatch(async (req, res, next) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return next(new ErrorHandler("All fields are required", 400));
  }

  let userAlreadyExists = await User.findOne({ email });

  if (userAlreadyExists) {
    if (!userAlreadyExists.isVerified) {
      // Delete unverified user if they exist
      await userAlreadyExists.deleteOne();
      console.log("Deleted unverified user:", userAlreadyExists.email);
    } else {
      // If verified, return an error without re-creating the user
      return next(new ErrorHandler("User already exists", 400));
    }
  }

  const verificationToken = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  const user = await User.create({
    email,
    password,
    name,
    verificationToken,
    verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  });

  // Send verification email
  sendVerificationMail(user.email, verificationToken);

  res.status(201).json({
    success: true,
    message:
      "We have sent an OTP to your email. Please verify your email address.",
    user: {
      ...user._doc,
      password: undefined, // Remove password from the response
    },
  });
});

const verifyEmail = TryCatch(async (req, res, next) => {
  const { code } = req.body;

  const user = await User.findOne({
    verificationToken: code,
    verificationTokenExpiresAt: { $gt: Date.now() },
  });

  if (!user)
    return next(new ErrorHandler("Invalid or expired verification code", 404));

  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpiresAt = undefined;
  await user.save();

  const token = generateTokenAndSetCookie(res, user._id);

  await sendWelcomeEmail(user.email, user.name);

  res.status(200).json({
    success: true,
    message: "Email verified successfully",
    token,
    user: {
      ...user._doc,
      password: undefined,
    },
  });
});

const login = TryCatch(async (req, res, next) => {
  console.log("hello");
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user) return next(new ErrorHandler("Invalid credentials", 400));

  const isPasswordValid = await compare(password, user.password);
  if (!isPasswordValid) {
    return next(new ErrorHandler("Invalid credentials", 400));
  }

  if (!user.isVerified)
    return next(
      new ErrorHandler(
        "Your Email Address is not verified plz verify your email address",
        404
      )
    );

  const token = generateTokenAndSetCookie(res, user._id);

  user.lastLogin = new Date();
  await user.save();

  return res.status(200).json({
    success: true,
    message: "Logged in successfully",
    token,
    user: {
      ...user._doc,
      password: undefined,
    },
  });
});

const logout = async (req, res) => {
  return res
    .status(200)
    .cookie("themeCraft-token", "", { ...cookieOptions, maxAge: 0 })
    .json({
      success: true,
      message: "Logged out successfully",
    });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;

    await user.save();

    // send email
    await sendPasswordResetEmail(
      user.email,
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    );

    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    console.log("Error in forgotPassword ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired reset token" });
    }

    // update password
    const hashedPassword = await bcryptjs.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    await sendResetSuccessEmail(user.email);

    res
      .status(200)
      .json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.log("Error in resetPassword ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

const myProfile = TryCatch(async (req, res, next) => {
  const user = await User.findById(req.user);
  return res.status(200).json({
    success: true,
    user,
  });
});

const googleLogin = TryCatch(async (req, res, next) => {
  passport.authenticate("google", { scope: ["profile", "email"] });
});

const editProfile = TryCatch(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user, req.body);
  if (!req.user) return next(new ErrorHandler("No Account Found!", 404));

  await user.save();
  return res.status(200).json({
    success: true,
    message: "Account Updated",
  });
});

const userDownloads = TryCatch(async (req, res, next) => {
  const user = await User.findById(req.user);
  if (!req.user) return next(new ErrorHandler("No Account Found!", 404));
  const items = await Item.find({ _id: { $in: user.downloads } });

  await user.save();
  return res.status(200).json({
    success: true,
    items,
  });
});

const uploadProfile = TryCatch(async (req, res, next) => {
  const image = req.file;
  const user = await User.findById(req.user);
  if (!image) return next(new ErrorHandler("Please select an image", 400));

  if (user?.profile?.public_id) {
    await cloudinary.uploader.destroy(user.profile.public_id);
  }

  const result = await uploadFilesToCloudinary([image]);
  const profile = {
    url: result[0].url,
    public_id: result[0].public_id,
  };
  user.profile = profile;

  await user.save();
  return res.status(200).json({
    success: true,
    message: "Profile Pic Updated",
  });
});

const deleteAccount = TryCatch(async (req, res, next) => {
  const user = await User.findById(req.user);

  await user.deleteOne();

  return res.status(200).json({
    success: true,
    message: "Account Deleted",
  });
});
const subscribeNewsLetter = TryCatch(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new ErrorHandler("Email is required", 404));
  }

  const alreadySubs = await Subscriber.findOne({ email });
  if (alreadySubs)
    return next(
      new ErrorHandler("You're Already Subscribed to newsletter", 400)
    );

  await Subscriber.create({
    email,
  });

  // Send verification email
  sendSubscriptionEmail(email);

  res.status(201).json({
    success: true,
    message: "Newsletter Subscribed",
  });
});

const likeItem = TryCatch(async (req, res, next) => {
  const item = await Item.findById(req.params.id);
  const user = await User.findById(req.user);
  if (item.likes.indexOf(req.user) === -1) {
    item.likes.push(req.user);
    await item.save();
    return res.status(200).json({
      success: true,
      message: "Template Liked",
      liked: item.likes.includes(user?._id),
    });
  }
  item.likes.splice(item.likes.indexOf(req.user), 1);
  await item.save();

  return res.status(200).json({
    success: true,
    message: "Item unliked",
    liked: item.likes.includes(user?._id),
  });
});
export {
  deleteAccount,
  editProfile,
  forgotPassword,
  googleLogin,
  login,
  logout,
  myProfile,
  resetPassword,
  signup,
  subscribeNewsLetter,
  uploadProfile,
  userDownloads,
  verifyEmail,
  likeItem,
};
