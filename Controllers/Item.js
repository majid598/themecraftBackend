import { TryCatch } from "../Middlewares/error.js";
import { Item } from "../Models/Item.js";
import { User } from "../Models/user.js";
import { uploadFilesToCloudinary } from "../Utils/features.js";
import ErrorHandler from "../Utils/utility.js";

const newItem = TryCatch(async (req, res, next) => {
  const user = await User.findById(req.user);
  const {
    name,
    price,
    domain,
    description,
    category,
    languages,
    zip,
    images
  } = req.body;

  console.log(images)

  if (!name ||
    !price ||
    !domain ||
    !description ||
    !category ||
    !languages) return next(new ErrorHandler("all fields are required", 400))

  const item = await Item.create({
    seller: req.user,
    name,
    price,
    domain,
    description,
    category,
    languages,
    zip,
    images,
  });

  await user.items.push(item);
  await user.save();

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
  const { category } = req.query
  if (category === "all") {
    const items = await Item.find().sort({ createdAt: -1 })
    return res.status(200).json({
      success: true,
      items,
    });
  }
  const items = await Item.find({ category })
  
  return res.status(200).json({
    success: true,
    items,
  });
});

const getItemById = TryCatch(async (req, res, next) => {
  const item = await Item.findById(req.params.id).populate("seller","name");

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

export { newItem, myItems, deleteLogo, editLogo, latestItems, allItems, getItemById };