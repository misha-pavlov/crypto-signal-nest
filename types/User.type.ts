export type MembershipPlanType = {
  _id: string;
  name: string;
  desc: string;
  price: string;
  limit: number;
};

export type UserType = {
  _id: string;
  name: string;
  email: string;
  cryptoList: string[];
  plan: 'basic' | 'silver' | 'gold' | 'platinum';
  password?: string;
  withGoogle?: boolean;
  withFacebook?: boolean;
}