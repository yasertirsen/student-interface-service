import { Component, OnInit } from '@angular/core';
import {PositionModel} from "../models/position.model";
import {PositionService} from "../shared/position.service";
import {LocalStorageService} from "ngx-webstorage";

@Component({
  selector: 'app-all-jobs',
  templateUrl: './all-jobs.component.html',
  styleUrls: ['./all-jobs.component.css']
})
export class AllJobsComponent implements OnInit {
  positions: PositionModel[];

  constructor(private positionService: PositionService, private localStorage: LocalStorageService) {
    this.positionService.getAllJobs().subscribe(data => {
      this.positions = data;
    })
  }

  ngOnInit(): void {
  }

}
