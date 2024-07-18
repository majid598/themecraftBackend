import express from "express";
import { jazzCashPay, subscribe, unSub } from "../Controllers/Subscribe.js";
import { isAuthenticated } from "../Middlewares/auth.js";
const router = express.Router();

router.post("/new", isAuthenticated, subscribe);
router.put("/unsub", isAuthenticated, unSub);
router.put("/jazzpay", isAuthenticated, jazzCashPay);

export default router;
