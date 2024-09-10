export enum EEnvironment {
  DEVELOPMENT = 'DEVELOPMENT',
  STAGING = 'STAGING',
  PRODUCTION = 'PRODUCTION',
}

export enum ERole {
  SYSTEM = 'SYSTEM',
  RESTAURANT_ADMIN = 'RESTAURANT_ADMIN',
  RESTAURANT_STAFF = 'RESTAURANT_STAFF',
  USER = 'USER',
}

export enum EGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export enum EAppLanguage {
  vi = 'vi',
  ja = 'ja',
  en = 'en',
}

export enum EStatus {
  REJECTED = 'REJECTED',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
}

export enum EOrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PREPARING = 'PREPARING',
  SERVED = 'SERVED',
  SHIPPING = 'SHIPPING',
  DELIVERED = 'DELIVERED',
  // paid
  COMPLETED = 'COMPLETED',
  CANCEL = 'CANCEL',
}

export enum EPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export enum EPlan {
  FREE = 'FREE',
  PREMIUM = 'PREMIUM',
}

export enum EBookingStatus {
  BOOKING = 'BOOKING',
  APPROVED = 'APPROVED',
  CANCEL = 'CANCEL',
}

export enum ETableStatus {
  OPEN = 'OPEN',
  INUSE = 'INUSE',
  BOOKED = 'BOOKED',
  GROUPED = "GROUPED"
}
