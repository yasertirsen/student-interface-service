import {ResumeModel} from "./resume.model";

export interface ApplicationModel {
  applicationId: number;
  fullName: string;
  email: string;
  resume: ResumeModel;
  positionId: number;
}
