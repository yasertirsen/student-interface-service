import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {PositionService} from "../../services/position.service";
import {PositionModel} from "../../models/position.model";
import {ResumeService} from "../../services/resume.service";
import {UserModel} from "../../models/user.model";
import {LocalStorageService} from "ngx-webstorage";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-view-job',
  templateUrl: './view-job.component.html',
  styleUrls: ['./view-job.component.css']
})
export class ViewJobComponent implements OnInit {
  positionId: number;
  position: PositionModel;
  user: UserModel;

  constructor(private resumeService: ResumeService, private positionService: PositionService, private userService: UserService,
              private activatedRoute: ActivatedRoute) {
    this.positionId = this.activatedRoute.snapshot.params.positionId;
    this.positionService.getJob(this.positionId).subscribe(position => {
      this.position = position;
    });
  }

  ngOnInit(): void {
  }
}
