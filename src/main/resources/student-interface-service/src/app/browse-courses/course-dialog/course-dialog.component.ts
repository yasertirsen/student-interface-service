import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {LinkedinDialogData} from "../../models/linkedin-dialog-data";
import {CourseDialogData} from "../../models/course-dialog-data";

@Component({
  selector: 'app-course-dialog',
  templateUrl: './course-dialog.component.html',
  styleUrls: ['./course-dialog.component.css']
})
export class CourseDialogComponent implements OnInit {
  skillNames: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<CourseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CourseDialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    for(let module of this.data.course.modules) {
      if(module.skill !== null && module.skill.skillName !== null) {
        this.skillNames.push(module.skill.skillName);
      }
    }
  }

}
