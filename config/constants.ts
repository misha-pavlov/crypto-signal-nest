import { colors } from "./colors";

export const mmkvStorageKeys = {
  wasStartScreenShown: "wasStartScreenShown",
  savedUserId: "savedUserId",
};

export const authSafeArea = { backgroundColor: colors.primaryBlack, flex: 1 };

export const membershipPlans = [
  {
    _id: "basic",
    name: "Basic Plan",
    desc: "Includes only 1 cryptocurrency",
    price: "Free",
  },
  {
    _id: "silver",
    name: "Silver Plan",
    desc: "Includes up to 3 cryptocurrencies",
    price: "$5 / month",
  },
  {
    _id: "gold",
    name: "Gold Plan",
    desc: "Includes up to 8 cryptocurrencies",
    price: "$10 / month",
  },
  {
    _id: "platinum",
    name: "Platinum Plan",
    desc: "Includes up to 12 cryptocurrencies",
    price: "$15 / month",
  },
];
