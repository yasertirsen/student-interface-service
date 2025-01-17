import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {UserModel} from "../../model/user.model";
import {ResumeService} from "../../service/resume.service";
import {ApplicationModel} from "../../model/application.model";

@Component({
  selector: 'app-apply-dialog',
  templateUrl: './apply-dialog.component.html',
  styleUrls: ['./apply-dialog.component.css']
})
export class ApplyDialogComponent implements OnInit {
  dynamicCv = 'true';
  selectedFile: File;
  fullName: string;
  user: UserModel;
  application: ApplicationModel = {
    applicationId: null,
    fullName: null,
    email: null,
    resume: null,
    positionId: null,
    status: null,
    date: null
  };


  constructor(public apply: MatDialogRef<ApplyDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {user: UserModel, positionId: number, companyName: string,
                jobTitle: string},
              private resumeService: ResumeService) {
    this.user = data.user;
    this.application.positionId = data.positionId;
    if(!!this.user.firstName && !!this.user.surname)
      this.fullName = this.user.firstName + ' ' + this.user.surname;
  }

  onNoClick(): void {
    this.apply.close();
  }

  onApply(): void {
    if(!!this.selectedFile && this.dynamicCv === 'false') {
      const uploadCvData = new FormData();
      uploadCvData.append('cvFile', this.selectedFile, 'dynamicCv');
      this.resumeService.uploadCv(uploadCvData, this.user.studentId).subscribe(response => {
        this.application.resume = response;
          this.sendApplication()
        },
        error => {
          console.log(error)
        });
    }
    else {
      this.resumeService.generateDynamicCv(this.user, this.data.companyName, this.data.jobTitle).subscribe(res => {
        this.application.resume = res;
        this.sendApplication()
      });
    }
  }

  sendApplication(): void {
    this.application.email = this.user.email;
    this.application.fullName = this.fullName;
    this.apply.close(this.application);
  }

  onFileChanged(event) {
    this.selectedFile = event.target.files[0];
  }

  ngOnInit(): void {
  }

}
