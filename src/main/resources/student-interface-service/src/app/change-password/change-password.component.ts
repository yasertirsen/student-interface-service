import { Component, OnInit } from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";
import {UserService} from "../services/user.service";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  email: string

  constructor(private _snackBar: MatSnackBar, private userService: UserService) { }

  changePassword() {
    this.userService.sendVerify(this.email).subscribe(data => {
      this._snackBar.open('Please check your email for further instructions', 'Close',
        {duration: 5000});
    },
      error => {
        this._snackBar.open('An error has occurred', 'Close',
          {duration: 5000});
      });
  }

  ngOnInit(): void {
  }

}
