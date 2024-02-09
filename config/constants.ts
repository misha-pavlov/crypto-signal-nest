import { Plan } from './../types/User.type';
import { colors } from "./colors";

export const mmkvStorageKeys = {
  wasStartScreenShown: "wasStartScreenShown",
  savedUserId: "savedUserId",
  userData: "userData",
  idToken: "idToken",
  isGoogleUser: "isGoogleUser",
  isAppleUser: "isAppleUser",
  password: "password",
};

export const authSafeArea = { backgroundColor: colors.primaryBlack, flex: 1 };

export const membershipPlans = [
  {
    _id: "basic" as Plan,
    name: "Basic Plan",
    desc: "Includes only 1 cryptocurrency",
    price: "Free",
    limit: 1,
  },
  {
    _id: "silver" as Plan,
    name: "Silver Plan",
    desc: "Includes up to 3 cryptocurrencies",
    price: "$5 / month",
    limit: 3,
  },
  {
    _id: "gold" as Plan,
    name: "Gold Plan",
    desc: "Includes up to 8 cryptocurrencies",
    price: "$10 / month",
    limit: 8,
  },
  {
    _id: "platinum" as Plan,
    name: "Platinum Plan",
    desc: "Includes up to 12 cryptocurrencies",
    price: "$15 / month",
    limit: 12,
  },
];
