import { Component, OnInit } from '@angular/core';
import {UserModel} from "../models/user.model";
import {UserService} from "../shared/user.service";
import {MatDialog} from "@angular/material/dialog";
import {AddLinkedinDialogComponent} from "../home/add-linkedin-dialog/add-linkedin-dialog.component";
import {EditSummaryComponent} from "./edit-summary/edit-summary.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AddProjectDialogComponent} from "./add-project-dialog/add-project-dialog.component";
import {AddExperienceDialogComponent} from "./add-experience-dialog/add-experience-dialog.component";

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
              private _snackBar: MatSnackBar) {
    this.userService.getCurrentUser().subscribe(user => {
      this.user = user;
      this.userService.getUserAvatar(this.user.studentId).subscribe(image => {
        if(image.data !== null) {
          this.base64Data = image.data;
          this.retrievedImage = 'data:image/jpeg;base64,' + this.base64Data;
        }
        this.loading = false;
      });
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
        console.log(result)
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

  updateUser(): void {
    this.userService.updateUser(this.user).subscribe(user => {
      this.user = user;
      this._snackBar.open('Updated successfully', 'Close', {
        duration: 3000,
      });
    });
  }

  ngOnInit(): void {
  }

}
