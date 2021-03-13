import {Component, OnInit, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {LoginRequest} from "../models/login-request-payload";
import {LoginResponse} from "../models/login-response-payload";
import {delay, first, map} from "rxjs/operators";
import {LocalStorageService} from "ngx-webstorage";
import {ActivatedRoute, Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UserService} from "../services/user.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  returnUrl: string;
  isError: boolean;
  model: LoginRequest = {
    email:'',
    password: ''
  };

  constructor(private userService: UserService,
              private activatedRoute: ActivatedRoute, private router: Router,
              private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams
      .subscribe(params => {
        if (params.registered !== undefined && params.registered === 'true') {
          this._snackBar.open('Please check your email inbox to '
            + 'activate your account before you login!', 'Close', {
            duration: 5000
          });
        }
        this.returnUrl = params.returnUrl? params.returnUrl: '/home'
      });
  }

  loginStudent(): void {
    this.userService.login(this.model)
      .pipe(first())
      .subscribe(data => {
      this.isError = false;
      this.router.navigateByUrl(this.returnUrl);
    }, error => {
      this.isError = true;
      this._snackBar.open('Login Failed. Please check your credentials and try again.', 'Close', {
        duration: 5000,
      });
    });
  }
}


