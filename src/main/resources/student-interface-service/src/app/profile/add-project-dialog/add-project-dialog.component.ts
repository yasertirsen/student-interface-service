import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ProjectModel} from "../../models/project.model";
import {Month} from "../../models/month.model";

@Component({
  selector: 'app-add-project-dialog',
  templateUrl: './add-project-dialog.component.html',
  styleUrls: ['./add-project-dialog.component.css']
})
export class AddProjectDialogComponent implements OnInit {
  project: ProjectModel = {
    projectId: null,
    title: null,
    description: null,
    date: null
  }
  selectedMonth: string;
  year: string;
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
    {value: 'Dec', viewValue: 'December'},
  ];

  constructor(public addProject: MatDialogRef<AddProjectDialogComponent>) { }

  onNoClick(): void {
    this.addProject.close()
  }

  onAdd(): void {
    if(this.year !== undefined && this.selectedMonth !== undefined) {
      this.project.date = this.selectedMonth + ' ' + this.year;
    }
    this.addProject.close(this.project);
  }

  ngOnInit(): void {
  }

}
