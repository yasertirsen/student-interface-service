import {SkillModel} from "./skill.model";

export interface ModuleModel {
  moduleId: number;
  name: string;
  skill: SkillModel;
}
