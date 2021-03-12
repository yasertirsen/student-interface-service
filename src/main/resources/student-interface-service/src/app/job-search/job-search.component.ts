import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {PositionService} from "../services/position.service";
import {ActivatedRoute} from "@angular/router";
import {PositionModel} from "../models/position.model";
import {NgbAlert} from "@ng-bootstrap/ng-bootstrap";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-job-search',
  templateUrl: './job-search.component.html',
  styleUrls: ['./job-search.component.css']
})
export class JobSearchComponent implements OnInit {

  jobsApi: PositionModel[];
  positions: PositionModel[];
  keywords: string;
  location: string;
  desc: string;
  loading = true;

  constructor(private positionService: PositionService, private activatedRoute: ActivatedRoute,
              private _snackBar: MatSnackBar) {
    this.keywords = this.activatedRoute.snapshot.params.keywords;
    this.location = this.activatedRoute.snapshot.params.location;
    this.positionService.searchPositions(this.location, this.keywords).subscribe(positions => {
      this.positions = positions;
    })
    this.positionService.searchJobsApi(this.location, this.keywords).subscribe( jobs => {
      this.jobsApi = jobs;
      if (this.jobsApi.length === 0 && this.positions.length === 0) {
        this._snackBar.open('No jobs found, please try searching with fewer keywords', 'Close', {
          duration: 5000,
        });
      }
      this.loading = false;
    });
  }

  ngOnInit(): void {
  }

}
