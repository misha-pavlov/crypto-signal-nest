export type Plan = "basic" | "silver" | "gold" | "platinum";

export type MembershipPlanType = {
  _id: Plan;
  name: string;
  desc: string;
  price: string;
  limit: number;
};

export type UserType = {
  _id: string;
  name: string;
  email: string;
  cryptoList: string;
  plan: Plan;
  signUpDate: string;
  verified: boolean;
  isAdmin?: boolean;
  avatar?: string | null;
};
export type UpdateUserData = {
  verified?: boolean;
  cryptoList?: string;
  plan?: Plan;
  name?: string;
  email?: string;
};
