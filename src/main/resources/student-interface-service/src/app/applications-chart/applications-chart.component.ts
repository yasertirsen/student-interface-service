import {Component, OnInit, ViewChild} from '@angular/core';
import {ChartType} from "angular-google-charts";
import {PositionService} from "../service/position.service";
import {UserModel} from "../model/user.model";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {UpdateStatusDialogComponent} from "./update-status-dialog/update-status-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-applications-chart',
  templateUrl: './applications-chart.component.html',
  styleUrls: ['./applications-chart.component.css']
})
export class ApplicationsChartComponent implements OnInit {
  type: ChartType = ChartType.PieChart;
  data: any = [];
  width = 1000;
  height = 500;
  columnNames = ['Status', 'Percentage'];
  options = {
    title: 'Applications Status',
    is3D:true,
    slices: {
      0: { color: 'blue' },
      1: { color: 'orange' },
      2: { color: 'purple' },
      3: { color: 'red' },
      4: {color: 'green'}
    }
  };
  user: UserModel;
  loading = true;
  noData = true;
  displayedColumns = ['date', 'title', 'company', 'location', 'cv', 'status', 'update'];
  datasource = new MatTableDataSource();
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
    this.datasource.paginator = this.paginator;
    this.datasource.sort = this.sort;
  }


  constructor(private positionService: PositionService, private dialog: MatDialog,
              private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    this.positionService.getUserApplicationsStats(this.user.email).subscribe(data => {
      console.log(data);
      if(!!data.statusData && !!data.applications) {
        this.noData = false;
        this.datasource.data = data.applications;
        for (let response of Object.keys(data.statusData)) {
          if(data.statusData[response] > 0) {
            this.data.push([response, data.statusData[response]]);
          }
        }
      }
      this.loading = false;
    });
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
    console.log(blob);
    window.open(fileURL, '_blank');
  }

  onEditName(application: any): void {
    const editDialog =
      this.dialog.open(UpdateStatusDialogComponent, {
        width: '500px',
        data: {status: application.status}
      });
    editDialog.afterClosed().subscribe(result => {
      if(result !== undefined) {
        application.status = result;
        this.positionService.updateApplication(application).subscribe(data => {
          window.location.reload();
          this._snackBar.open('Updated Successfully', 'Close', {duration: 3000})
        },
        error => {
          console.log(error);
        });
      }
    });
  }
}
