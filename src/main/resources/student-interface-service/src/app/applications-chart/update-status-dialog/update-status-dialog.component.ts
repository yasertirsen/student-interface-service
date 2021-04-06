import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

export interface Action {
  viewValue: string;
  value: string;
}

@Component({
  selector: 'app-edit-names-dialog',
  templateUrl: './update-status-dialog.component.html',
  styleUrls: ['./update-status-dialog.component.css']
})
export class UpdateStatusDialogComponent implements OnInit {
  actions: Action[] = [
    {value: 'Rejected', viewValue: 'Rejected'},
    {value: 'Asked For Interview', viewValue: 'Asked For Interview'},
    {value: 'Offered', viewValue: 'Offered'},
    {value: 'Under Review', viewValue: 'Under Review'},
    {value: 'No Response', viewValue: 'No Response'}];
  status: string;

  constructor(public updateStatus: MatDialogRef<UpdateStatusDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {status: string}) { }

  onNoClick(): void {
    this.updateStatus.close();
  }

  ngOnInit(): void {
  }

}
