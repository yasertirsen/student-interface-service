import { Component, OnInit } from '@angular/core';
import {CourseModel} from "../model/course.model";
import {CourseService} from "../service/course.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-browse-courses',
  templateUrl: './browse-courses.component.html',
  styleUrls: ['./browse-courses.component.css']
})
export class BrowseCoursesComponent implements OnInit {

  courses: CourseModel[];
  loading = true;

  constructor(private courseService: CourseService, private router: Router) {
  }

  onAddCourse(): void {
    this.router.navigateByUrl('/add-course');
  }

  ngOnInit(): void {
    this.courseService.getAllCourses().subscribe( course => {
      this.courses = course;
      this.loading = false;
    });
  }

}
