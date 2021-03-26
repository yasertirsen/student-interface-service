import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {PositionService} from "../../service/position.service";
import {PositionModel} from "../../model/position.model";
import {ResumeService} from "../../service/resume.service";
import {UserModel} from "../../model/user.model";
import {LocalStorageService} from "ngx-webstorage";
import {UserService} from "../../service/user.service";

@Component({
  selector: 'app-view-job',
  templateUrl: './view-job.component.html',
  styleUrls: ['./view-job.component.css']
})
export class ViewJobComponent implements OnInit {
  positionId: number;
  position: PositionModel;
  user: UserModel;
  loading = true;

  constructor(private resumeService: ResumeService, private positionService: PositionService, private userService: UserService,
              private activatedRoute: ActivatedRoute) {
    this.positionId = this.activatedRoute.snapshot.params.positionId;
    this.positionService.getJob(this.positionId).subscribe(position => {
      this.position = position;
      this.loading = false;
    });
  }

  ngOnInit(): void {
  }
}
