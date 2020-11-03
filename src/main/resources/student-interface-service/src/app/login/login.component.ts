import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {LoginRequest} from "../models/login-request-payload";
import {LoginResponse} from "../models/login-response-payload";
import {map, tap} from "rxjs/operators";
import {LocalStorageService} from "ngx-webstorage";
import {ToastrService} from "ngx-toastr";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  registerSuccessMessage: string;
  isError: boolean;
  refreshTokenPayload = {
    refreshToken: this.getRefreshToken(),
    username: this.getUserName()
  };

  model: LoginRequest = {
    username:'',
    password: ''
  };

  constructor(private client: HttpClient, private localStorage: LocalStorageService,
              private activatedRoute: ActivatedRoute, private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams
      .subscribe(params => {
        if (params.registered !== undefined && params.registered === 'true') {
          this.toastr.success('Registration Successful');
          this.registerSuccessMessage = 'Please Check your inbox for activation email '
            + 'activate your account before you Login!';
        }
      });
  }

  loginStudent(): void {
    let url = 'http://localhost:8082/api/students/login';
    this.client.post<LoginResponse>(url, this.model).pipe(map(data => {
      this.localStorage.store('authenticationToken', data.authenticationToken);
      this.localStorage.store('username', data.username);
      this.localStorage.store('refreshToken', data.refreshToken);
      this.localStorage.store('expiresAt', data.expiresAt);
    })).subscribe(data => {
      this.isError = false;
      this.router.navigateByUrl('/home');
      this.toastr.success('Login Successful');
    }, error => {
      this.isError = true;
    });
  }

  getJwtToken() {
    return this.localStorage.retrieve('authenticationToken');
  }

  refreshToken() {
    return this.client.post<LoginResponse>('http://localhost:8082/api/students/refresh/token',
      this.refreshTokenPayload)
      .pipe(tap(response => {
        this.localStorage.clear('authenticationToken');
        this.localStorage.clear('expiresAt');

        this.localStorage.store('authenticationToken',
          response.authenticationToken);
        this.localStorage.store('expiresAt', response.expiresAt);
      }));
  }

  getUserName() {
    return this.localStorage.retrieve('username');
  }
  getRefreshToken() {
    return this.localStorage.retrieve('refreshToken');
  }

}


