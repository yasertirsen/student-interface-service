import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {PositionService} from "../shared/position.service";
import {ActivatedRoute} from "@angular/router";
import {PositionModel} from "../models/position.model";
import {NgbAlert} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-job-search',
  templateUrl: './job-search.component.html',
  styleUrls: ['./job-search.component.css']
})
export class JobSearchComponent implements OnInit {

  @ViewChild('staticAlertNoJobsFound', {static: false}) staticAlertNoJobsFound: NgbAlert;

  positions: PositionModel[];
  keywords: string;
  location: string;
  noJobsFoundMessage: string = 'No jobs found, please try searching with fewer keywords';
  isError: boolean;
  anyName: string;

  constructor(private positionService: PositionService, private  activatedRoute: ActivatedRoute) {
    this.keywords = this.activatedRoute.snapshot.params.keywords;
    this.location = this.activatedRoute.snapshot.params.location;
    this.positionService.searchJobsApi(this.location, this.keywords).subscribe( position => {
      this.positions = position;
      this.anyName = this.positions[0].description;
    });

    if (this.positions == undefined || this.positions.length == 0) {
      this.isError = true;
    }
  }

  ngOnInit(): void {
    setTimeout(() => this.staticAlertNoJobsFound.close(), 10000);
  }

}
