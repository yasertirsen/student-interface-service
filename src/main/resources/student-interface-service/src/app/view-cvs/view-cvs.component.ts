import {Component, OnInit, ViewChild} from '@angular/core';
import {ResumeService} from "../service/resume.service";
import {UserModel} from "../model/user.model";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {EditSummaryComponent} from "../profile/edit-summary/edit-summary.component";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {EditNamesDialogComponent} from "./edit-names-dialog/edit-names-dialog.component";

@Component({
  selector: 'app-view-cvs',
  templateUrl: './view-cvs.component.html',
  styleUrls: ['./view-cvs.component.css']
})
export class ViewCvsComponent implements OnInit {
  user: UserModel;
  cvs = new MatTableDataSource();
  displayedColumns = ['name', 'view', 'edit'];

  private paginator: MatPaginator;
  private sort: MatSort;

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }

  setDataSourceAttributes() {
    this.cvs.paginator = this.paginator;
    this.cvs.sort = this.sort;
  }

  constructor(private resumeService: ResumeService, private dialog: MatDialog,
              private _snackBar: MatSnackBar) {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    this.resumeService.getUserCvs(this.user.studentId).subscribe(data => {
      this.cvs.data = data;
    },
      error => {
      console.log(error);
      });
  }

  ngOnInit(): void {
  }

  onCv(cv: any) {
    console.log(cv);
    let byteCharacters = atob(cv.data);
    let byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    let byteArray = new Uint8Array(byteNumbers);
    let blob = new Blob([byteArray], {type: "application/pdf"});
    let fileURL = URL.createObjectURL(blob);
    window.open(fileURL, '_blank');
  }

  onEditName(cv: any): void {
    const editDialog =
      this.dialog.open(EditNamesDialogComponent, {
        width: '500px',
        data: {name: cv.name}
      });
    editDialog.afterClosed().subscribe(result => {
      if(result !== undefined) {
        cv.name = result;
        this.resumeService.updateCv(cv).subscribe(data => {
          this._snackBar.open('Saved Successfully', 'Close', {duration: 3000})
        });
      }
    });
  }
}
