import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ExperienceModel} from "../../model/experience.model";
import {Month} from "../../model/month.model";

interface Flag {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-add-experience-dialog',
  templateUrl: './add-experience-dialog.component.html',
  styleUrls: ['./add-experience-dialog.component.css']
})
export class AddExperienceDialogComponent implements OnInit {
  beginMonth: string;
  beginYear: string;
  endMonth: string;
  endYear: string;
  selectedOption: boolean;
  experience: ExperienceModel = {
    experienceId: null,
    company: null,
    role: null,
    description: null,
    begin: null,
    end: null,
    location: null,
    voluntary: null
  };
  options: Flag[] = [
    {value: 'true', viewValue: 'Yes'},
    {value: 'false', viewValue: 'No'}
  ];
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

  constructor(public addExperience: MatDialogRef<AddExperienceDialogComponent>) { }

  onNoClick(): void {
    this.addExperience.close()
  }

  onAdd(): void {
    if(this.beginYear !== undefined && this.beginMonth !== undefined) {
      this.experience.begin = this.beginMonth + ' ' + this.beginYear;
    }
    if(this.endYear !== undefined && this.endMonth !== undefined) {
      this.experience.end = this.endMonth + ' ' + this.endYear;
    }
    if(this.selectedOption !== undefined) {
      this.experience.voluntary = this.selectedOption;
    }
    this.addExperience.close(this.experience);
  }

  ngOnInit(): void {
  }

}
