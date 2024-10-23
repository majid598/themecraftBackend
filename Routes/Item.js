import express from "express";
import {
  deleteLogo,
  editLogo,
  myItems,
  newItem,
  latestItems,
  allItems,
  getItemById,
  searchItems,
  downloadItem,
} from "../Controllers/Item.js";
import { isAuthenticated } from "../Middlewares/auth.js";
import { singleAvatar } from "../Middlewares/multer.js";
const router = express.Router();

router.post("/new", isAuthenticated, singleAvatar, newItem);
router.get("/my/all", isAuthenticated, myItems);
router.get("/all/latest", latestItems);
router.get("/all", allItems);
router.get("/search", searchItems);
router.delete("/delete/:id", isAuthenticated, deleteLogo);
router.get("/get/:id", getItemById);
router.put("/edit/:id", isAuthenticated, editLogo);
router.get("/download/:id", isAuthenticated, downloadItem);

export default router;
