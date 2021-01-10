import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {PositionService} from "../position.service";
import {PositionModel} from "../../models/position.model";

@Component({
  selector: 'app-view-job',
  templateUrl: './view-job.component.html',
  styleUrls: ['./view-job.component.css']
})
export class ViewJobComponent implements OnInit {
  positionId: number;
  position: PositionModel;

  constructor(private positionService: PositionService, private activatedRoute: ActivatedRoute) {
    this.positionId = this.activatedRoute.snapshot.params.positionId;
    this.positionService.getJob(this.positionId).subscribe(position => {
      this.position = position;
    });
  }

  ngOnInit(): void {
  }

}
