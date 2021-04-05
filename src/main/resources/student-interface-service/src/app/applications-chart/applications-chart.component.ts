import {Component, OnInit, ViewChild} from '@angular/core';
import {ChartType} from "angular-google-charts";
import {PositionService} from "../service/position.service";
import {UserModel} from "../model/user.model";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {EditNamesDialogComponent} from "../view-cvs/edit-names-dialog/edit-names-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {ResumeService} from "../service/resume.service";

@Component({
  selector: 'app-applications-chart',
  templateUrl: './applications-chart.component.html',
  styleUrls: ['./applications-chart.component.css']
})
export class ApplicationsChartComponent implements OnInit {
  title = 'Applications';
  type: ChartType = ChartType.Sankey;
  data: any = [];
  width = 1000;
  height = 600;
  user: UserModel;
  loading = true;
  displayedColumns = ['date', 'title', 'company', 'location', 'cv', 'status'];
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
              private resumeService: ResumeService) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    this.positionService.getUserApplicationsStats(this.user.email).subscribe(data => {
      console.log(data);
      this.datasource.data = data.applications;
      for (let response of Object.keys(data.statusData)) {
        if(data.statusData[response] > 0) {
            this.data.push(['Applications ' + data.applications.length, response + ': ' + data.statusData[response], data.statusData[response]]);
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
}
