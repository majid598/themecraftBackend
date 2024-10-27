import nodemailer from "nodemailer";
import { NEWSLETTER_SUBSCRIPTION_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js";

export const sendVerificationMail = (email, code) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL, // Your Gmail address
      pass: process.env.PASS, // Your Gmail password or app-specific password
    },
  });

  const mailOptions = {
    from: `"ThemeCraft" <${process.env.MAIL}>`, // Your Gmail address as the sender
    to: email, // recipient's email address
    subject: "Email Verification",
    html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", code),
    text: "Verify your email",
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log("Error:", error);
    }
    console.log("Email sent:", info.response);
  });
};
export const sendSubscriptionEmail = (email) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL, // Your Gmail address
      pass: process.env.PASS, // Your Gmail password or app-specific password
    },
  });

  const mailOptions = {
    from: `"ThemeCraft" <${process.env.MAIL}>`, // Your Gmail address as the sender
    to: email, // recipient's email address
    subject: "Newsletter",
    html: NEWSLETTER_SUBSCRIPTION_TEMPLATE,
    text: "Thanks for subscribing our newsletter",
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log("Error:", error);
    }
    console.log("Email sent:", info.response);
  });
};
export const sendWelcomeEmail = (email, code) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL, // Your Gmail address
      pass: process.env.PASS, // Your Gmail password or app-specific password
    },
  });

  const mailOptions = {
    from: `"ThemeCraft" <${process.env.MAIL}>`, // Your Gmail address as the sender
    to: email, // recipient's email address
    subject: "Email Verification",
    html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", code),
    text: "Verify your email",
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log("Error:", error);
    }
    console.log("Email sent:", info.response);
  });
};

