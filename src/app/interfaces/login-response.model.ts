import {UserRole} from '../enums/user-role.enum';

export interface ILoginResponse {
  email: string;
  role: UserRole;
  access_token: string;
}
