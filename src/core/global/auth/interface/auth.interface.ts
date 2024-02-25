import { ERole } from 'src/core/enum/default.enum';

export interface IResponseAuthUser {
  id: number;
  email: string;
  role: ERole;
  restaurantId?: number | null;
}

export interface IResponseAuth {
  user: IResponseAuthUser;
  accessToken: string;
}

export interface IJwtPayload {
  uid: number;
  eml: string;
  rol: ERole;
  rid?: number | null;
}

export interface IResponseRefreshToken {
  accessToken: string;
}
