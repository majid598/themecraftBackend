import { TryCatch } from "../Middlewares/error.js";
import { Contact } from "../Models/contact.js";
import ErrorHandler from "../Utils/utility.js";
import { sendContactEmail } from "../Emails/emails.js";

const contact = TryCatch(async (req, res, next) => {
  const { email, name, phone, companyName, subject, message } = req.body;

  if (!email || !name || !phone || !subject || !message) {
    return next(new ErrorHandler("All fields are required", 400));
  }

  const contact = await Contact.create({
    email,
    name,
    phone,
    companyName,
    subject,
    message,
  });

  // Send email notification
  await sendContactEmail(contact);

  res.status(201).json({
    success: true,
    message: "Thanks for reaching out to us",
    contact,
  });
});
const allContacts = TryCatch(async (req, res, next) => {
  const contacts = await Contact.find();

  res.status(201).json({
    success: true,
    contacts,
  });
});

export { contact, allContacts };
