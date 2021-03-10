import {Component,  OnInit} from '@angular/core';
import {UserModel} from "../models/user.model";
import { MatDialog } from "@angular/material/dialog";
import {AddLinkedinDialogComponent} from "./add-linkedin-dialog/add-linkedin-dialog.component";
import {LocalStorageService} from "ngx-webstorage";
import {UserService} from "../shared/user.service";
import {ActivatedRoute} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {PositionModel} from "../models/position.model";
import {PositionService} from "../shared/position.service";

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

  constructor(public dialog: MatDialog, private localStorage: LocalStorageService, private userService: UserService,
              private activatedRoute: ActivatedRoute, private _snackBar: MatSnackBar, private positionService: PositionService) {
    this.userService.getCurrentUser().subscribe(user => {
      this.user = user;
      this.socialUrl = this.user.socialUrl;
      this.userService.getUserAvatar(this.user.studentId).subscribe(image => {
        if(image.data !== null) {
          this.base64Data = image.data;
          this.retrievedImage = 'data:image/jpeg;base64,' + this.base64Data;
        }
      });
      this.positionService.getRecommendedJobs(this.user.email).subscribe(jobs => {
        this.recommendedPositions = jobs
        this.loading = false;
      },
        error => {
        console.log(error);
          this._snackBar.open('Error getting your recommended jobs', 'Close', {
            duration: 3000,
          });
        });
    });
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
      this.user = user;
      this._snackBar.open('LinkedIn profile added successfully', 'Close', {
        duration: 5000,
      });
    });
  }

  ngOnInit(): void {
  }

}

