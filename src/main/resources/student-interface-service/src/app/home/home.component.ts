import {Component, Inject, OnInit} from '@angular/core';
import {UserModel} from "../models/user.model";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {AddLinkedinDialogComponent} from "./add-linkedin-dialog/add-linkedin-dialog.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  socialUrl: string;
  user: UserModel;

  constructor(public dialog: MatDialog) { }

  openDialog(): void {
    const dialogRef =
      this.dialog.open(AddLinkedinDialogComponent, {
        width: '500px',
        data: {socialUrl: this.socialUrl}
      });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog was closed');
      this.socialUrl = result;
      console.log(result);
    })
  }

  ngOnInit(): void {
  }

}

