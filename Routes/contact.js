import express from "express";
import { allContacts, contact } from "../Controllers/contact.js";
import { quote } from "../Controllers/quote.js";
import { isAuthenticated } from "../Middlewares/auth.js";
const router = express.Router();

router.post("/", contact);
router.get("/", allContacts);
router.post("/quote", isAuthenticated, quote);

export default router;
