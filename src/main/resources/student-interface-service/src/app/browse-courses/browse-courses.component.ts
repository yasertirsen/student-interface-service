import { Component, OnInit } from '@angular/core';
import {CourseModel} from "../models/course.model";
import {CourseService} from "../shared/course.service";

@Component({
  selector: 'app-browse-courses',
  templateUrl: './browse-courses.component.html',
  styleUrls: ['./browse-courses.component.css']
})
export class BrowseCoursesComponent implements OnInit {

  courses: CourseModel[];
  isError: boolean;

  constructor(private courseService: CourseService) {
    this.courseService.getAllCourses().subscribe( course => {
      this.courses = course;
    });

    if (this.courses == undefined || this.courses.length == 0) {
      this.isError = true;
    }
  }

  ngOnInit(): void {
  }

}
