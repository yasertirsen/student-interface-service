import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {RegisterRequest} from "../model/register-request-payload";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  hide = true;
  model: RegisterRequest = {
    username:'',
    email:'',
    password:''
  };

  constructor(private client: HttpClient, private router: Router,
              private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  registerStudent(): void {
    let url = 'http://localhost:8083/register';
    this.client.post(url, this.model)
      .subscribe(data => {
        this.router.navigate(['/login'],
          {queryParams: {registered: 'true'}});
      }, error => {
        console.log(error);
        this._snackBar.open('Registration Failed! Please try again', 'Close',
          {
            duration: 5000
          });
      });
  }
}
