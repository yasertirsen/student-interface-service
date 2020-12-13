import {Component, Input, OnInit} from '@angular/core';
import {CourseModel} from "../../models/course.model";

@Component({
  selector: 'app-course-tile',
  templateUrl: './course-tile.component.html',
  styleUrls: ['./course-tile.component.css']
})
export class CourseTileComponent implements OnInit {

  @Input() courses: CourseModel[];

  constructor() { }

  ngOnInit(): void {
  }

}
