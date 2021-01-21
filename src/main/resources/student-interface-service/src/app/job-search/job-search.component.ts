import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {PositionService} from "../shared/position.service";
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

  positions: PositionModel[];
  keywords: string;
  location: string;
  desc: string;

  constructor(private positionService: PositionService, private activatedRoute: ActivatedRoute,
              private _snackBar: MatSnackBar) {
    this.keywords = this.activatedRoute.snapshot.params.keywords;
    this.location = this.activatedRoute.snapshot.params.location;
    this.positionService.searchJobsApi(this.location, this.keywords).subscribe( positions => {
      this.positions = positions;
      if (this.positions === undefined || this.positions.length === 0) {
        this._snackBar.open('No jobs found, please try searching with fewer keywords', 'Close', {
          duration: 5000,
        });
      }
    });
  }

  ngOnInit(): void {
  }

}
