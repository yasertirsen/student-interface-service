import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserModel} from "../models/user.model";
import {LocalStorageService} from "ngx-webstorage";
import {UserService} from "../shared/user.service";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-complete-profile',
  templateUrl: './complete-profile.component.html',
  styleUrls: ['./complete-profile.component.css']
})
export class CompleteProfileComponent implements OnInit {
  isLinear = false;
  firstFormGroup: FormGroup;
  phoneFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  user: UserModel;
  bio: string;
  firstName: string;
  surname: string;
  phone: string;
  loading: boolean;

  constructor(private _formBuilder: FormBuilder, private localStorage: LocalStorageService,
              private userService: UserService, private router: Router,
              private _snackBar: MatSnackBar) {
    this.loading = true;
    this.userService.getCurrentUser().subscribe(user => {
      this.user = user;
      this.firstName = this.user.firstName;
      this.surname = this.user.surname;
      this.phone = this.user.phone;
      this.bio = this.user.profile.bio;
    });
    this.loading = false;
  }

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      firstName: ['', Validators.required],
      surname: ['', Validators.required]
    });
    this.phoneFormGroup = this._formBuilder.group({
      phoneCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }

  onDone(): void {
    this.user.profile.bio = this.bio;
    this.user.firstName = this.firstName;
    this.user.surname = this.surname;
    this.user.phone = this.phone;
    this.updateUser();
  }

  updateUser(): void {
    this.userService.updateUser(this.user).subscribe(user => {
      this.user = user;
      this._snackBar.open('Profile updated, now you can generate dynamic CVs!', 'Close', {
        duration: 5000
      });
      this.router.navigateByUrl('/home');
    });
  }
}
