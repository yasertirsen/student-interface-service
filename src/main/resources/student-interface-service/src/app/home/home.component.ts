import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {UserModel} from "../models/user.model";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {AddLinkedinDialogComponent} from "./add-linkedin-dialog/add-linkedin-dialog.component";
import {LocalStorageService} from "ngx-webstorage";
import {UserService} from "../shared/user.service";
import {NgbAlert} from "@ng-bootstrap/ng-bootstrap";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  @ViewChild('staticAlertSuccess', {static: false}) staticAlertSuccess: NgbAlert;
  @ViewChild('staticAlertFail', {static: false}) staticAlertFail: NgbAlert;
  socialUrl: string;
  user: UserModel;
  isError: boolean;
  successMessage: string;
  failMessage: string;

  constructor(public dialog: MatDialog, private localStorage: LocalStorageService, private userService: UserService,
              private activatedRoute: ActivatedRoute) {
    this.userService.getCurrentUser().subscribe(user => {
      this.user = user;
      this.socialUrl = this.user.socialUrl;
    });
  }

  openDialog(): void {
    const dialogRef =
      this.dialog.open(AddLinkedinDialogComponent, {
        width: '500px',
        data: {socialUrl: this.socialUrl}
      });

    dialogRef.afterClosed().subscribe(result => {
      this.socialUrl = result;
      this.user.socialUrl = this.socialUrl;
      this.updateUser();
      this.successMessage = 'LinkedIn profile added successfully'
    });
  }

  updateUser(): void {
    this.userService.updateUser(this.user).subscribe(user => {
      this.user = user;
    });
  }

  ngOnInit(): void {
    setTimeout(() => this.staticAlertSuccess.close(), 10000);
    setTimeout(() => this.staticAlertFail.close(), 10000);

    this.activatedRoute.queryParams
      .subscribe(params => {
        if (params.assigned !== undefined && params.assigned === 'true') {
          this.successMessage = 'Course assigned successfully';
        }
      });
  }

}

