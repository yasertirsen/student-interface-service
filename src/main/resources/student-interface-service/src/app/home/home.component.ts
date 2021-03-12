import {Component,  OnInit} from '@angular/core';
import {UserModel} from "../models/user.model";
import { MatDialog } from "@angular/material/dialog";
import {AddLinkedinDialogComponent} from "./add-linkedin-dialog/add-linkedin-dialog.component";
import {LocalStorageService} from "ngx-webstorage";
import {UserService} from "../services/user.service";
import {ActivatedRoute} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {PositionModel} from "../models/position.model";
import {PositionService} from "../services/position.service";
import {ProfileModel} from "../models/profile.model";
import {forkJoin} from "rxjs";
import {CompanyWrapperModel} from "../models/companyWrapper.model";
import {delay} from "rxjs/operators";

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
    //   this.userService.getUserAvatar(this.user.studentId).subscribe(image => {
    //     if(image.data !== null) {
    //       this.base64Data = image.data;
    //       this.retrievedImage = 'data:image/jpeg;base64,' + this.base64Data;
    //     }
    //   });
    //   this.positionService.getRecommendedJobs(this.user.email).subscribe(jobs => {
    //     this.recommendedPositions = jobs
    //     this.loading = false;
    //   },
    //     error => {
    //     console.log(error);
    //       this._snackBar.open('Error getting your recommended jobs', 'Close', {
    //         duration: 3000,
    //       });
    //     });
  }

  openDialog(): void {
    const dialogRef =
      this.dialog.open(AddLinkedinDialogComponent, {
        width: '500px',
        data: {socialUrl: this.socialUrl}
      });

    dialogRef.afterClosed().subscribe(result => {
      if(result !== null && result !== '') {
        this.socialUrl = result;
        this.user.socialUrl = this.socialUrl;
        this.updateUser();
      }
    });
  }

  updateUser(): void {
    this.userService.updateUser(this.user).subscribe(user => {
      localStorage.setItem('currentUser', JSON.stringify(user));
      this._snackBar.open('LinkedIn profile added successfully', 'Close', {
        duration: 5000,
      });
    });
  }

  getAvatarAndRecommendations() {
    let getAvatar = this.userService.getUserAvatar(this.user.studentId);
    let getRecommendations = this.positionService.getRecommendedJobs(this.user.email);

    forkJoin([getAvatar, getRecommendations]).subscribe(results => {
      if(results[0].data !== null) {
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

