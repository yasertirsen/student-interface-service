import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {UserModel} from "../../model/user.model";

@Component({
  selector: 'app-hired-students-dialog',
  templateUrl: './hired-students-dialog.component.html',
  styleUrls: ['./hired-students-dialog.component.css']
})
export class HiredStudentsDialogComponent implements OnInit {

  constructor(public hiredStudents: MatDialogRef<HiredStudentsDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {hiredStudents: UserModel[]}) { }

  onNoClick(): void {
    this.hiredStudents.close();
  }

  ngOnInit(): void {
  }

}
