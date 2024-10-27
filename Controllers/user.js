import bcrypt, { compare } from "bcrypt";
import passport from "passport";
import { TryCatch } from "../Middlewares/error.js";
import { User } from "../Models/user.js";
import {
  cookieOptions,
  generateTokenAndSetCookie,
  sendToken,
  uploadFilesToCloudinary,
} from "../Utils/features.js";
import ErrorHandler from "../Utils/utility.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { v2 as cloudinary } from "cloudinary";
import { sendMail, sendVerificationEmail, sendWelcomeEmail } from "../mailtrap/emails.js";

const signup = TryCatch(async (req, res, next) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name)
    return next(new ErrorHandler("All fields are required", 400));

  const userAlreadyExists = await User.findOne({ email });
  console.log("userAlreadyExists", userAlreadyExists);

  if (userAlreadyExists)
    return next(new ErrorHandler("User already exists", 400));

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

  sendMail(user.email, verificationToken);

  res.status(201).json({
    success: true,
    message: "We have sent an otp on your email plz verify your email address",
    user: {
      ...user._doc,
      password: undefined,
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

export {
  editProfile,
  googleLogin,
  login,
  logout,
  myProfile,
  signup,
  resetPassword,
  verifyEmail,
  forgotPassword,
  deleteAccount,
  uploadProfile,
};
