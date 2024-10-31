import express from "express";
import { contact } from "../Controllers/contact.js";
import { quote } from "../Controllers/quote.js";
const router = express.Router();

router.post("/", contact);
router.post("/quote", quote);

export default router;
