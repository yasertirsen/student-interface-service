import { Component, OnInit } from '@angular/core';
import {CourseModel} from "../models/course.model";
import {CourseService} from "../services/course.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-browse-courses',
  templateUrl: './browse-courses.component.html',
  styleUrls: ['./browse-courses.component.css']
})
export class BrowseCoursesComponent implements OnInit {

  courses: CourseModel[];
  isError: boolean;

  constructor(private courseService: CourseService, private router: Router) {
    this.courseService.getAllCourses().subscribe( course => {
      this.courses = course;
    });

    if (this.courses == undefined || this.courses.length == 0) {
      this.isError = true;
    }
  }

  onAddCourse(): void {
    this.router.navigateByUrl('/add-course');
  }

  ngOnInit(): void {
  }

}
