export interface IUserData {
  uid: number;
  eml: string;
  rol: string;
  rid?: number;
  [key: string]: any;
}

export interface IPaginationQuery {
  page: number;
  take: number;
  skip: number;
  [key: string]: any;
}

export interface IPaginationResponse {
  data: any;
  totalItems: number;
  page: number;
  totalPages: number;
  take: number;
}
