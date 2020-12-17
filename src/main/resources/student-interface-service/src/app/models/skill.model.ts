import {IndustryModel} from "./industry.model";

export interface SkillModel {
  skillId: number;
  skillName: string;
  industry: IndustryModel;
}
