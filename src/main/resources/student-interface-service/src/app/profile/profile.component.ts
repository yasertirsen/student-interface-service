import { Component, OnInit } from '@angular/core';
import {UserModel} from "../model/user.model";
import {UserService} from "../service/user.service";
import {MatDialog} from "@angular/material/dialog";
import {EditSummaryComponent} from "./edit-summary/edit-summary.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AddProjectDialogComponent} from "./add-project-dialog/add-project-dialog.component";
import {AddExperienceDialogComponent} from "./add-experience-dialog/add-experience-dialog.component";
import {AddSkillsDialogComponent} from "./add-skills-dialog/add-skills-dialog.component";
import {ResumeService} from "../service/resume.service";
import {DomSanitizer} from "@angular/platform-browser";

declare var require: any
const FileSaver = require('file-saver');

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  loading = true;
  user: UserModel;
  retrievedImage: any = null;
  base64Data: any;

  constructor(private userService: UserService, private dialog: MatDialog,
              private _snackBar: MatSnackBar, private resumeService: ResumeService) {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
      this.userService.getUserAvatar(this.user.studentId).subscribe(image => {
        if(image.data !== null) {
          this.base64Data = image.data;
          this.retrievedImage = 'data:image/jpeg;base64,' + this.base64Data;
        }
        this.loading = false;
      });
  }

  openSummaryDialog(): void {
    const summaryDialog =
      this.dialog.open(EditSummaryComponent, {
        width: '500px',
        data: {summary: this.user.profile.bio}
      });
    summaryDialog.afterClosed().subscribe(result => {
      if(result !== undefined) {
        this.user.profile.bio = result;
        this.updateUser();
      }
    });
  }

  openProjectDialog(): void {
    const projectDialog =
      this.dialog.open(AddProjectDialogComponent, {
        width: '500px'
      });
    projectDialog.afterClosed().subscribe(result => {
      if(result !== undefined) {
        this.user.profile.projects.push(result);
        this.updateUser();
      }
    });
  }

  openExperienceDialog(): void {
    const experienceDialog =
      this.dialog.open(AddExperienceDialogComponent, {
        width: '500px'
      });
    experienceDialog.afterClosed().subscribe(result => {
      if(result !== undefined) {
        this.user.profile.experiences.push(result);
        this.updateUser();
      }
    });
  }

  openSkillsDialog(): void {
    const skillsDialog =
      this.dialog.open(AddSkillsDialogComponent, {
        width: '500px',
        data: this.user.profile.externalSkills
      });
    skillsDialog.afterClosed().subscribe(result => {
      if(result !== undefined) {
        this.user.profile.externalSkills = result;
        this.updateUser();
      }
      else {
        this._snackBar.open('No skills were added', 'Close', {
          duration: 3000,
        });
      }
    });
  }

  onDownload(): void {
    this.resumeService.getCv(this.user.username).subscribe(res => {
      const fileURL = URL.createObjectURL(res);
      FileSaver.saveAs(fileURL, this.user.username + '_CV');
      //window.open(fileURL, '_blank');
    });
  }

  updateUser(): void {
    this.userService.updateProfile(this.user.profile).subscribe(data => {
      this.user.profile = data;
      localStorage.setItem('currentUser', JSON.stringify(this.user));
      this._snackBar.open('Updated successfully', 'Close', {
        duration: 3000,
      });
    });
  }

  ngOnInit(): void {
  }
}
