import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {LinkedinDialogData} from "../../models/linkedin-dialog-data";
import {CourseDialogData} from "../../models/course-dialog-data";
import {FormControl, FormGroup} from "@angular/forms";
import {CourseModel} from "../../models/course.model";
import {Month} from "../../models/month.model";

@Component({
  selector: 'app-course-dialog',
  templateUrl: './course-dialog.component.html',
  styleUrls: ['./course-dialog.component.css']
})
export class CourseDialogComponent implements OnInit {
  beginMonth: string;
  beginYear: string;
  endMonth: string;
  endYear: string;
  months: Month[] = [
    {value: 'Jan', viewValue: 'January'},
    {value: 'Feb', viewValue: 'February'},
    {value: 'Mar', viewValue: 'March'},
    {value: 'Apr', viewValue: 'April'},
    {value: 'May', viewValue: 'May'},
    {value: 'Jun', viewValue: 'June'},
    {value: 'Jul', viewValue: 'July'},
    {value: 'Aug', viewValue: 'August'},
    {value: 'Sep', viewValue: 'September'},
    {value: 'Oct', viewValue: 'October'},
    {value: 'Nov', viewValue: 'November'},
    {value: 'Dec', viewValue: 'December'}
  ];

  constructor(
    public dialogRef: MatDialogRef<CourseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CourseDialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onAssign(): void {
    if(this.beginYear !== undefined && this.endYear !== undefined) {
      this.data.start = this.beginMonth + ' ' + this.beginYear;
      this.data.end = this.endMonth + ' ' + this.endYear;
    }
    this.dialogRef.close(this.data);
  }

  ngOnInit(): void {
  }

}
