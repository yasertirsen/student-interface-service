import {Component, OnInit} from '@angular/core';
import {LoginRequest} from "../model/login-request-payload";
import {first} from "rxjs/operators";
import {ActivatedRoute, Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UserService} from "../service/user.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  hide = true;
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
        if(params.registered !== undefined && params.registered === 'true') {
          this._snackBar.open('Please check your email inbox to '
            + 'activate your account before you login!', 'Close', {
            duration: 5000
          });
        }
        if(!!params.token) {
          this.userService.verify(params.token).subscribe(data => {
              this._snackBar.open(data, 'Close', {duration: 3000});
          },
            error => {
              this._snackBar.open('Error while verifying account', 'Close', {duration: 3000});
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


