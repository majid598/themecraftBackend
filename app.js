import { v2 as cloudinary } from 'cloudinary';
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import passport from "passport";
import Stripe from "stripe";
import { errorMiddleware } from "./Middlewares/error.js";
import { connectDb } from "./Utils/db.js";
const app = express();

dotenv.config({
  path: "./.env",
});

app.use(
  session({
    secret: "hey",
    resave: false,
    saveUninitialized: false,

    cookie: {
      secure: true,
      httpOnly: true,
      sameSite: "none",
    },
  })
);

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:4173",
      process.env.CLIENT_URL,
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

app.use(passport.authenticate("session"));
app.use(passport.initialize());
app.use(passport.session());
app.enable("trust proxy");

export const stripe = new Stripe(process.env.STRIPE_KEY)

// connectPassport();

app.get("/", (req, res) => {
  res.send("Server Is Working Perfectly");
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


import itemRoute from "./Routes/Item.js";
import subscribeRoute from "./Routes/Subscribe.js";
import userRoute from "./Routes/user.js";
import { connectPassport } from "./Utils/passport-setup.js";

connectDb(process.env.MONGO_URI);

app.use("/api/v1/user", userRoute);
app.use("/api/v1/item", itemRoute);
app.use("/api/v1/subscribe", subscribeRoute);

app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is runnig at port number ${PORT}`);
});
