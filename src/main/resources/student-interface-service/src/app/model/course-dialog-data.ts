import {CourseModel} from "./course.model";

export interface CourseDialogData {
  course: CourseModel;
  start: string;
  end: string;
  averageGrade: number;
}
