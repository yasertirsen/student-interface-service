import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserModel} from "../models/user.model";
import {LocalStorageService} from "ngx-webstorage";
import {UserService} from "../shared/user.service";
import {Router} from "@angular/router";
import {SkillModel} from "../models/skill.model";

@Component({
  selector: 'app-complete-profile',
  templateUrl: './complete-profile.component.html',
  styleUrls: ['./complete-profile.component.css']
})
export class CompleteProfileComponent implements OnInit {
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  user: UserModel;
  bio: string;

  constructor(private _formBuilder: FormBuilder, private localStorage: LocalStorageService,
              private userService: UserService, private router: Router) {
    this.userService.getCurrentUser().subscribe(user => {
      this.user = user;
    });
  }

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }

  onDone(): void {
    this.user.profile.bio = this.bio;
    this.updateUser();
  }

  updateUser(): void {
    this.userService.updateUser(this.user).subscribe(user => {
      this.user = user;
      this.router.navigateByUrl('/home',
        {queryParams: {completed: 'true'}});
    });
  }
}
