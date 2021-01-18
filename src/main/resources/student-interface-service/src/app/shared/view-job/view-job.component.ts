import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {PositionService} from "../position.service";
import {PositionModel} from "../../models/position.model";
import {ResumeService} from "../resume.service";
import {UserModel} from "../../models/user.model";
import {LocalStorageService} from "ngx-webstorage";
import {UserService} from "../user.service";

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
              private activatedRoute: ActivatedRoute, private localStorage: LocalStorageService, router: Router) {
    this.positionId = this.activatedRoute.snapshot.params.positionId;
    this.positionService.getJob(this.positionId).subscribe(position => {
      this.position = position;
      this.userService.getCurrentUser().subscribe(user => {
        this.user = user;
        this.user.profile.externalSkills = this.position.requirements;
      });
    });
  }

  ngOnInit(): void {
  }

  onGenerateCv() {
    // this.resumeService.generateDynamicCv(this.user).subscribe(res => {
    //   const fileURL = URL.createObjectURL(res);
    //   window.open(fileURL, '_blank');
    // });
  }
}
