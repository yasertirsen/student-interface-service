import { Component, OnInit } from '@angular/core';
import {PositionModel} from "../models/position.model";
import {PositionService} from "../services/position.service";
import {LocalStorageService} from "ngx-webstorage";

@Component({
  selector: 'app-all-jobs',
  templateUrl: './all-jobs.component.html',
  styleUrls: ['./all-jobs.component.css']
})
export class AllJobsComponent implements OnInit {
  positions: PositionModel[] = [];
  priority: PositionModel[] = [];

  constructor(private positionService: PositionService) {
    this.positionService.getAllJobs().subscribe(data => {
      for(let position of data) {
        if(position.priority === true)
          this.priority.push(position);
        else
          this.positions.push(position);
      }
    });
  }

  ngOnInit(): void {
  }

}
