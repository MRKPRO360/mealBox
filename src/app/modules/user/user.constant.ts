export const USER_ROLE = {
  superAdmin: 'superAdmin',
  customer: 'customer',
  provider: 'provider',
  admin: 'admin',
} as const;

export const METHOD = {
  credentials: 'credentials',
  github: 'github',
  google: 'google',
} as const;

export const UserStatus = ['in-progress', 'blocked'];

export type TMethod = (typeof METHOD)[keyof typeof METHOD];

export type TUserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];
