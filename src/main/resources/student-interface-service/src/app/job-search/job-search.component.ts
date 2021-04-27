import {Component, OnInit} from '@angular/core';
import {PositionService} from "../service/position.service";
import {ActivatedRoute} from "@angular/router";
import {PositionModel} from "../model/position.model";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-job-search',
  templateUrl: './job-search.component.html',
  styleUrls: ['./job-search.component.css']
})
export class JobSearchComponent implements OnInit {

  jobsApi: PositionModel[] = [];
  positions: PositionModel[] = [];
  priority: PositionModel[] = [];
  keywords: string;
  location: string;
  loading = true;

  constructor(private positionService: PositionService, private activatedRoute: ActivatedRoute,
              private _snackBar: MatSnackBar) {
    this.keywords = this.activatedRoute.snapshot.params.keywords;
    this.location = this.activatedRoute.snapshot.params.location;
    this.positionService.searchPositions(this.location, this.keywords).subscribe(positions => {
      for(let position of positions) {
        if(position.priority === true)
          this.priority.push(position);
        else
          this.positions.push(position);
      }
    });
    this.positionService.searchJobsApi(this.location, this.keywords).subscribe( jobs => {
      this.jobsApi = jobs;
      console.log(jobs);
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
