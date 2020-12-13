import {ModuleModel} from "./module.model";

export interface CourseModel {
  courseId: number;
  name: string;
  university: string;
  level: number;
  url: string;
  modules: Array<ModuleModel>;
}
