import {ProfileModel} from "./profile.model";

export interface UserModel {
  studentId: number;
  firstName: string;
  surname: string;
  password: string;
  email: string;
  username: string;
  phone: string;
  socialUrl: string;
  created: string;
  enabled: boolean;
  role: string;
  authorities: string[];
  isLocked: boolean;
  profile: ProfileModel;
  resumePath: string;

}
