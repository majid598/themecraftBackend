import express from "express";
import { deleteLogo, editLogo, myItems, newItem, latestItems, allItems,getItemById } from "../Controllers/Item.js";
import { isAuthenticated } from "../Middlewares/auth.js";
import { singleAvatar } from "../Middlewares/multer.js";
const router = express.Router();

router.post("/new", isAuthenticated, singleAvatar, newItem);
router.get("/my/all", isAuthenticated, myItems);
router.get("/all/latest", isAuthenticated, latestItems);
router.get("/all", isAuthenticated, allItems);
router.delete("/delete/:id", isAuthenticated, deleteLogo);
router.get("/get/:id", isAuthenticated, getItemById);
router.put("/edit/:id", isAuthenticated, editLogo);

export default router;
