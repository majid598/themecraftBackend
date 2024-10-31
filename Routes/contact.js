import express from "express";
import { allContacts, contact } from "../Controllers/contact.js";
import { quote } from "../Controllers/quote.js";
const router = express.Router();

router.post("/", contact);
router.get("/", allContacts);
router.post("/quote", quote);

export default router;
