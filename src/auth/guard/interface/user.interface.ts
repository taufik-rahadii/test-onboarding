export enum UserType {
  Customer = 'customer',
  Merchant = 'merchant',
  Admin = 'admin',
}

export enum Role {
  Customer = 'customer',
  Merchant = 'merchant',
  Admin = 'admin',
}

export enum Level {
  Group = 'group',
  Merchant = 'merchant',
  Store = 'store',
}

export interface IUser {
  id: string;
  user_type: UserType;
  role: Role;
  level: Level;
  permissions: string[];
}
