export enum HttpMethod {
  GET = "get",
  POST = "post",
}

export interface AdminsResponse {
  admins: Account[];
}

export interface Account {
  uuid: string;
  firstName: string;
  lastName: string;
}

export interface User {
  uuid: string;
  firstName: string;
  lastName: string;
}

export interface Device {
  uuid: string;
  manufacturer: string;
  ownerId: string;
}
