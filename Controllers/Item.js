import { TryCatch } from "../Middlewares/error.js";
import { Item } from "../Models/Item.js";
import { User } from "../Models/user.js";
import ErrorHandler from "../Utils/utility.js";

const newItem = TryCatch(async (req, res, next) => {
  const user = await User.findById(req.user);
  const {
    name,
    title,
    title2,
    image,
    desc1,
    desc2,
    features,
    inTheBox,
    lbPlg,
    zipFile,
    domain,
    category,
  } = req.body;

  if (!name || !title || !domain || !desc1 || !category || !features)
    return next(new ErrorHandler("all fields are required", 400));

  const item = await Item.create({
    name,
    title,
    title2,
    image,
    desc1,
    desc2,
    features,
    inTheBox,
    lbPlg,
    zipFile,
    domain,
    category,
  });

  return res.status(200).json({
    success: true,
    message: "Item added",
  });
});

const myItems = TryCatch(async (req, res, next) => {
  const items = await Item.find({ seller: req.user }).sort({ createdAt: -1 });

  return res.status(200).json({
    success: true,
    items,
  });
});

const latestItems = TryCatch(async (req, res, next) => {
  const items = await Item.find().sort({ createdAt: -1 }).limit(8);

  return res.status(200).json({
    success: true,
    items,
  });
});

const allItems = TryCatch(async (req, res, next) => {
  const { category, page = 1, limit = 12 } = req.query; // default to page 1 and 20 items per page

  const query = category && category !== "all" ? { category } : {}; // Filter by category if it's specified

  // Convert page and limit to numbers and calculate the number of items to skip
  const items = await Item.find(query).sort({ createdAt: -1 });

  // Get the total number of items for pagination info
  const totalItems = await Item.countDocuments(query);
  const totalPages = Math.ceil(totalItems / limit);

  return res.status(200).json({
    success: true,
    items,
    totalItems,
    totalPages,
    currentPage: page,
  });
});

const searchItems = TryCatch(async (req, res, next) => {
  const { query } = req.query;

  const items = await Item.find({
    $or: [
      { name: { $regex: query, $options: "i" } },
      { title: { $regex: query, $options: "i" } },
      { title2: { $regex: query, $options: "i" } },
      { category: { $regex: query, $options: "i" } },
      { desc1: { $regex: query, $options: "i" } },
      { desc2: { $regex: query, $options: "i" } },
    ],
  });

  return res.status(200).json({
    success: true,
    items,
  });
});

const getItemById = TryCatch(async (req, res, next) => {
  const item = await Item.findById(req.params.id).populate(
    "reviews.user",
    "name profile"
  );

  return res.status(200).json({
    success: true,
    item,
  });
});

const deleteLogo = TryCatch(async (req, res, next) => {
  const Item = await Item.findById(req.params.id);
  const user = User.findById(req.user);

  await Item.deleteOne();
  // user.logos.pull(req.params.id);
  // await user.save();

  return res.status(200).json({
    success: true,
    message: "Logo deleted",
  });
});

const editLogo = TryCatch(async (req, res, next) => {
  const {
    ItemImage,
    bgRounded,
    padding,
    iconSize,
    selectedIcon,
    iconRotation,
    iconColor,
    ItemBgColor,
    imageOpacity,
  } = req.body;
  const updatedData = {
    ItemImage,
    bgRounded,
    padding,
    iconSize,
    selectedIcon,
    iconRotation,
    iconColor,
    ItemBgColor,
    imageOpacity,
  };
  const Item = await Item.findByIdAndUpdate(req.params.id, updatedData);
  if (!req.params.id) return next(new ErrorHandler("No Item Found!", 404));

  await Item.save();
  return res.status(200).json({
    success: true,
    message: "Logo Updated",
  });
});

const downloadItem = TryCatch(async (req, res, next) => {
  const user = await User.findById(req.user);
  await Item.findByIdAndUpdate(req.params.id, { $inc: { downloads: 1 } });
  user.downloads.push(req.params.id);
  await user.save();
  return res
    .status(200)
    .json({ success: true, message: "Template Downloaded Successfully" });
});

export {
  allItems,
  deleteLogo,
  editLogo,
  getItemById,
  latestItems,
  myItems,
  newItem,
  searchItems,
  downloadItem,
};
