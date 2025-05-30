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
export const sendContactMail = (email, code) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL, // Your Gmail address
      pass: process.env.PASS, // Your Gmail password or app-specific password
    },
  });

  const mailOptions = {
    from: `"ThemeCraft Alert" <${process.env.MAIL}>`, // Your Gmail address as the sender
    to: email, // recipient's email address
    subject: "Message Alert",
    html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", code),
    text: "Hi dear Majid ali you have a message on your site Themecraft",
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log("Error:", error);
    }
    console.log("Email sent:", info.response);
  });
};
export const sendContactEmail = async (contactData) => {
  const { name, email, phone, companyName, subject, message } = contactData;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL,
      pass: process.env.PASS,
    },
  });

  const mailOptions = {
    from: `"ThemeCraft" <${process.env.MAIL}>`,
    to: process.env.OWNER_EMAIL,
    subject: `You have a new contact: ${subject}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      ${companyName ? `<p><strong>Company:</strong> ${companyName}</p>` : ""}
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};
export const sendQuoteEmail = async (quoteData) => {
  const { name, email, phone, companyName, lookingFor, budget, about } = quoteData;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL,
      pass: process.env.PASS,
    },
  });

  const mailOptions = {
    from: `"ThemeCraft" <${process.env.MAIL}>`,
    to: process.env.OWNER_EMAIL,
    subject: "You have a new Quote Request",
    html: `
      <h2>New Quote Request</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      ${companyName ? `<p><strong>Company:</strong> ${companyName}</p>` : ""}
      <p><strong>Looking For:</strong> ${lookingFor}</p>
      <p><strong>Budget:</strong> ${budget}</p>
      <p><strong>About Project:</strong></p>
      <p>${about}</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};