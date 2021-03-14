import {CompanyModel} from "./company.model";

export interface CompanyWrapperModel {
  company: CompanyModel;
  users: SimpleUser[];
}

export interface SimpleUser {
  studentId: number;
  firstName: string;
}
