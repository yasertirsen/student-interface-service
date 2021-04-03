import {Component, OnInit} from '@angular/core';
import {ChartType} from "angular-google-charts";
import {PositionService} from "../service/position.service";
import {UserModel} from "../model/user.model";

@Component({
  selector: 'app-applications-chart',
  templateUrl: './applications-chart.component.html',
  styleUrls: ['./applications-chart.component.css']
})
export class ApplicationsChartComponent implements OnInit {
  title = 'Applications';
  type: ChartType = ChartType.Sankey;
  data: any = [];
  width = 800;
  height = 600;
  user: UserModel;
  loading = true;


  constructor(private positionService: PositionService) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    this.positionService.getUserApplicationsStats(this.user.email).subscribe(data => {
      console.log(data);
      for (let response of Object.keys(data)) {
        if(data[response] > 0) {
            this.data.push(['Applications', response, data[response]]);
        }
      }
      this.loading = false;
    });
  }
}
