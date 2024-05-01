export enum UserRole {
  ADMIN = 'Admin',
  SECRETARA = 'Secretara',
  STUDENT = 'Student',
}

export interface ILoginResponse {
  email: string;
  role: UserRole;
  access_token: string;
}
