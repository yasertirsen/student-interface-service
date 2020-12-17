import {CourseModel} from "./course.model";
import {SkillModel} from "./skill.model";

export interface ProfileModel {
  profileId: number;
  course: CourseModel;
  externalSkills: SkillModel[];
}
