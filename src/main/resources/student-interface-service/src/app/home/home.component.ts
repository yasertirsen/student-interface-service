import {Component, OnInit} from '@angular/core';
import {UserModel} from "../model/user.model";
import {MatDialog} from "@angular/material/dialog";
import {UserService} from "../service/user.service";
import {ActivatedRoute} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {PositionModel} from "../model/position.model";
import {PositionService} from "../service/position.service";
import {forkJoin} from "rxjs";
import {AddSkillsDialogComponent} from "../profile/add-skills-dialog/add-skills-dialog.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  socialUrl: string;
  user: UserModel;
  isError: boolean;
  loading = true;
  retrievedImage: any = null;
  base64Data: any;
  recommendedPositions: PositionModel[] = [];

  constructor(public dialog: MatDialog, private userService: UserService,
              private activatedRoute: ActivatedRoute, private _snackBar: MatSnackBar, private positionService: PositionService) {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    this.socialUrl = this.user.socialUrl;
    this.getAvatarAndRecommendations();
  }

  openDialog(): void {
    const dialogRef =
      this.dialog.open(AddSkillsDialogComponent, {
        width: '500px',
        data: this.user.profile.externalSkills
      });

    dialogRef.afterClosed().subscribe(result => {
      if(!!result) {
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

  updateUser(): void {
    this.userService.updateProfile(this.user.profile).subscribe(data => {
      this.user.profile = data;
      localStorage.setItem('currentUser', JSON.stringify(this.user));
      this._snackBar.open('Updated successfully', 'Close', {
        duration: 3000,
      });
    });
  }

  getAvatarAndRecommendations() {
    let getAvatar = this.userService.getUserAvatar(this.user.studentId);
    let getRecommendations = this.positionService.getRecommendedJobs(this.user.email);

    forkJoin([getAvatar, getRecommendations]).subscribe(results => {
      if(!!results[0].data) {
        this.base64Data = results[0].data;
        this.retrievedImage = 'data:image/jpeg;base64,' + this.base64Data;
      }
      this.recommendedPositions = results[1];
      this.loading = false
    }, error1 => {
      this.loading = false;
      console.log(error1);
      this._snackBar.open('An error has occurred', 'Close', {
        duration: 3000,
      });
    });
  }

  ngOnInit(): void {
  }

}

