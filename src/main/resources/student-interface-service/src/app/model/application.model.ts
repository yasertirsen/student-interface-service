import {ResumeModel} from "./ResumeModel";

export interface ApplicationModel {
  applicationId: number;
  fullName: string;
  email: string;
  resume: ResumeModel;
  positionId: number;
}
