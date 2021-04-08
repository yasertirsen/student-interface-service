import {Component, OnInit} from '@angular/core';
import {UserModel} from "../model/user.model";
import {MatDialog} from "@angular/material/dialog";
import {AddLinkedinDialogComponent} from "./add-linkedin-dialog/add-linkedin-dialog.component";
import {UserService} from "../service/user.service";
import {ActivatedRoute} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {PositionModel} from "../model/position.model";
import {PositionService} from "../service/position.service";
import {forkJoin} from "rxjs";

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
      this.dialog.open(AddLinkedinDialogComponent, {
        width: '500px',
        data: {socialUrl: this.socialUrl}
      });

    dialogRef.afterClosed().subscribe(result => {
      if(result !== undefined) {
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

