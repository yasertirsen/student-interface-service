import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserModel} from "../model/user.model";
import {LocalStorageService} from "ngx-webstorage";
import {UserService} from "../service/user.service";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatSelectChange} from "@angular/material/select";

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
  selectedFile: File;
  races: string[] = ['White', 'Black or African-American', 'American Indian or Alaskan Native', 'Asian',
    'Native Hawaiian or other Pacific islander', 'From multiple races'];
  ages: string[] = ['17 or younger', '18-20', '21-29', '30-39', '40-49', '50-59', '60 or older'];

  constructor(private _formBuilder: FormBuilder,
              private userService: UserService, private router: Router,
              private _snackBar: MatSnackBar) {
    this.loading = true;
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    this.firstName = this.user.firstName;
    this.surname = this.user.surname;
    this.phone = this.user.phone;
    this.bio = this.user.profile.bio;
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

  selectedGender(event: MatSelectChange) {
    this.user.profile.gender = event.value;
  }

  selectedAge(event: MatSelectChange) {
    this.user.profile.age = event.value;
  }

  selectedRace(event: MatSelectChange) {
    this.user.profile.race = event.value;
  }

  updateUser(): void {
    this.userService.updateUser(this.user).subscribe(user => {
      localStorage.setItem('currentUser', JSON.stringify(user));
      this._snackBar.open('Profile updated successfully', 'Close', {
        duration: 5000
      });
      this.router.navigateByUrl('/home');
    });
  }

  onFileChanged(event) {
    this.selectedFile = event.target.files[0];
  }

  onUpload() {

    const uploadImageData = new FormData();
    uploadImageData.append('imageFile', this.selectedFile, this.user.username + '_avatar');

    this.userService.uploadImage(uploadImageData, this.user.studentId).subscribe(response => {
      this._snackBar.open('Profile image updates successfully', 'Close', {
        duration: 3000
      });
    },
      error => {
      console.log(error)
      });
  }
}
