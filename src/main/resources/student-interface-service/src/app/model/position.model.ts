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
  priority: boolean;
  archive: boolean;
  company: CompanyModel;
  requirements: SkillModel[];
}
