import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {LoginRequest} from "../models/login-request-payload";
import {LoginResponse} from "../models/login-response-payload";
import {map, tap} from "rxjs/operators";
import {LocalStorageService} from "ngx-webstorage";
import {ToastrService} from "ngx-toastr";
import {ActivatedRoute, Router} from "@angular/router";
import {NgbAlert} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @ViewChild('staticAlertSuccess', {static: false}) staticAlertSuccess: NgbAlert;
  @ViewChild('staticAlertFail', {static: false}) staticAlertFail: NgbAlert;

  registerSuccessMessage: string;
  loginFailMessage: string = 'Login Failed. Please check your credentials and try again.';
  isError: boolean;

  model: LoginRequest = {
    email:'',
    password: ''
  };

  constructor(private client: HttpClient, private localStorage: LocalStorageService,
              private activatedRoute: ActivatedRoute, private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
    setTimeout(() => this.staticAlertSuccess.close(), 10000);
    setTimeout(() => this.staticAlertFail.close(), 10000);

    this.activatedRoute.queryParams
      .subscribe(params => {
        if (params.registered !== undefined && params.registered === 'true') {
          this.registerSuccessMessage = 'Please check your email inbox to '
            + 'activate your account before you login!';
        }
      });
  }

  loginStudent(): void {
    let url = 'http://localhost:8083/login';
    this.client.post<LoginResponse>(url, this.model).pipe(map(data => {
      this.localStorage.store('token', data.token);
      this.localStorage.store('email', data.email);
      this.localStorage.store('expiresIn', data.expiresIn);
    })).subscribe(data => {
      this.isError = false;
      this.router.navigateByUrl('/home');
      this.toastr.success('Login Successful');
    }, error => {
      this.isError = true;
    });
  }

  getJwtToken() {
    return this.localStorage.retrieve('token');
  }

  getEmail() {
    return this.localStorage.retrieve('email');
  }
}


