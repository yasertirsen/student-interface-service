import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-edit-names-dialog',
  templateUrl: './edit-names-dialog.component.html',
  styleUrls: ['./edit-names-dialog.component.css']
})
export class EditNamesDialogComponent implements OnInit {

  constructor(public editName: MatDialogRef<EditNamesDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {name: string}) { }

  onNoClick(): void {
    this.editName.close();
  }

  ngOnInit(): void {
  }

}
