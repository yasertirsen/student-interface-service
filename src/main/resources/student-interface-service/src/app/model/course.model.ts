import {ModuleModel} from "./module.model";

export interface CourseModel {
  courseId: number;
  name: string;
  university: string;
  level: string;
  url: string;
  modules: Array<ModuleModel>;
}
