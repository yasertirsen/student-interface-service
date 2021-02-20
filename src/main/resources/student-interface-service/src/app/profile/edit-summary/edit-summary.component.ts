import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-edit-summary',
  templateUrl: './edit-summary.component.html',
  styleUrls: ['./edit-summary.component.css']
})
export class EditSummaryComponent implements OnInit {

  constructor(public editSummary: MatDialogRef<EditSummaryComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {summary: string}) { }

  onNoClick(): void {
    this.editSummary.close();
  }

  ngOnInit(): void {
  }

}
