import {Component,OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-get-updates-dialog',
  templateUrl: './get-updates-dialog.component.html',
  styleUrls: ['./get-updates-dialog.component.css']
})
export class GetUpdatesDialogComponent implements OnInit {

  constructor(public getUpdates: MatDialogRef<GetUpdatesDialogComponent>) { }

  onNoClick(): void {
    this.getUpdates.close(false);
  }

  onAdd(): void {
    this.getUpdates.close(true);
  }

  ngOnInit(): void {
  }

}
