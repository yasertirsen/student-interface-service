import {Component, Inject, OnInit} from '@angular/core';
import {UserModel} from "../../model/user.model";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {LinkedinDialogData} from "../../model/linkedin-dialog-data";

@Component({
  selector: 'app-add-linkedin-dialog',
  templateUrl: './add-linkedin-dialog.component.html',
  styleUrls: ['./add-linkedin-dialog.component.css']
})

export class AddLinkedinDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<AddLinkedinDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: LinkedinDialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
  }

}
