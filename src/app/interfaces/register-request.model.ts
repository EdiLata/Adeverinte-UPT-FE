import {Specialization} from '../enums/specialization.enum';
import {Faculty} from '../enums/faculty.enum';

export interface IRegisterRequest {
  email: string;
  password: string;
  faculty?: Faculty;
  specialization?: Specialization;
  year?: number;
}
