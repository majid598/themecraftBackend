import Jazzcash from "jazzcash-checkout";
import { TryCatch } from "../Middlewares/error.js";
import { User } from "../Models/user.js";
import { stripe } from "../app.js";

const subscribe = TryCatch(async (req, res, next) => {
  const { plan, amount, currency } = req.body;
  console.log(plan, amount, currency);

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency,
  });

  console.log(paymentIntent.client_secret);

  const user = await User.findById(req.user);
  user.isSubscribed = true;
  user.subscribedPlan = plan;

  await user.save();

  return res.status(200).json({
    success: true,
    message: `You Have Subscribe Plan For ${plan}`,
    client_secret: paymentIntent.client_secret,
  });
});

const unSub = TryCatch(async (req, res, next) => {
  const user = await User.findById(req.user);
  user.isSubscribed = false;
  user.subscribedPlan = "";

  await user.save();

  return res.status(200).json({
    success: true,
    message: `You Have unSubscribed to Your Plan`,
  });
});

// initializes your jazzcash
Jazzcash.credentials({
  config: {
    merchantId: "", // Merchant Id
    password: "", // Password
    hashKey: "", // Hash Key
  },
  environment: "sandbox", // available environment live or sandbox
});

const JC = {
  wallet: (data, callback) => {
    Jazzcash.setData(data);
    Jazzcash.createRequest("WALLET").then((res) => {
      res = JSON.parse(res);
      console.log(res);

      // callback function
      callback(res);
    });
  },

  pay: (data, callback) => {
    Jazzcash.setData(data);
    Jazzcash.createRequest("PAY").then((res) => {
      console.log(res);

      // callback function
      callback(res);
    });
  },

  refund: (data, callback) => {
    Jazzcash.setData(data);
    Jazzcash.createRequest("REFUND").then((res) => {
      res = JSON.parse(res);
      console.log(res);

      // callback function
      callback(res);
    });
  },

  inquiry: (data, callback) => {
    Jazzcash.setData(data);
    Jazzcash.createRequest("INQUIRY").then((res) => {
      res = JSON.parse(res);
      console.log(res);

      // callback function
      callback(res);
    });
  },
};

const jazzCashPay = TryCatch(async (req, res, next) => {
  const data = {
    pp_Version: "1.1",
    pp_DiscountedAmount: "",
    pp_DiscountBank: "",
    pp_Amount: "1000",
    pp_TxnCurrency: "PKR",
    pp_BillReference: "billRef123",
    pp_Description: "Description of transaction",
  };

  JC.pay(data, (res) => {
    if (res.pp_SecureHash) {
      // success code here
    } else {
      // failure code here
    }
  });
});

export { subscribe, unSub, jazzCashPay };
