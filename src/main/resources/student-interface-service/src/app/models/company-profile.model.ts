import {UserModel} from "./user.model";

export interface CompanyProfileModel {
  profileId: number;
  hiredStudents: UserModel[];
}
