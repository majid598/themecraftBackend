import express from "express";
import passport from "passport";
import {
  deleteAccount,
  editProfile,
  verifyEmail,
  forgotPassword,
  login,
  logout,
  myProfile,
  signup,
  resetPassword,
  uploadProfile,
} from "../Controllers/user.js";
import { isAuthenticated } from "../Middlewares/auth.js";
import { singleAvatar } from '../Middlewares/multer.js'
const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/verify-email", verifyEmail);

// router.get("/otp", getOtp);

// router.get(
//   "/google",
//   passport.authenticate("google", { scope: ["profile", "email"] })
// );

// router.get(
//   "/google/login",
//   passport.authenticate("google", { failureRedirect: "/api/v1/user/google" }),
//   (req, res) => {
//     res.redirect(process.env.CLIENT_URL);
//   }
// );

router.get("/logout", isAuthenticated, logout);

router.get("/me", isAuthenticated, myProfile);

router.put("/upload/profile", isAuthenticated, singleAvatar, uploadProfile);

// router.post("/resend-email", isAuthenticated, resendEmail);

router.put("/me/profile/edit", isAuthenticated, editProfile);
router.delete("/me/profile/delete", isAuthenticated, deleteAccount);
router.post("/reset-password", resetPassword);

export default router;
