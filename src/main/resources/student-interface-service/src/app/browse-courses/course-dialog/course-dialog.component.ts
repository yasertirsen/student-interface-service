import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {CourseDialogData} from "../../model/course-dialog-data";
import {Month} from "../../model/month.model";

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
  averageGrade: number;
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
    if(!!this.beginYear && !!this.endYear) {
      this.data.start = this.beginMonth + ' ' + this.beginYear;
      this.data.end = this.endMonth + ' ' + this.endYear;
      this.data.averageGrade = this.averageGrade;
    }
    this.dialogRef.close(this.data);
  }

  ngOnInit(): void {
  }

}
