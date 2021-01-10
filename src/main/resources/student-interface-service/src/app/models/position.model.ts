import {CompanyModel} from "./company.model";
import {SkillModel} from "./skill.model";

export interface PositionModel {
  positionId: number;
  title: string;
  description: string;
  location: string;
  date: string;
  salary: number;
  url: string;
  clicks: number;
  company: CompanyModel;
  requirements: SkillModel[];
}
