import { Component, OnInit } from '@angular/core';
import {UserService} from "../services/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-verify-change-password',
  templateUrl: './verify-change-password.component.html',
  styleUrls: ['./verify-change-password.component.css']
})
export class VerifyChangePasswordComponent implements OnInit {
  password: string;
  hide = true;

  constructor(private userService: UserService, private activatedRoute: ActivatedRoute, private router: Router,
              private _snackBar: MatSnackBar) {}

  ngOnInit(): void {
  }

  changePassword() {
    this.userService.verifyToken(this.activatedRoute.snapshot.params.token, this.password).subscribe(data => {
        this._snackBar.open('Password updated successfully', 'Close', {duration: 5000})
        this.router.navigateByUrl('/login');
      },
      error => {
        this._snackBar.open('Invalid token', 'Close', {duration: 5000})
        this.router.navigateByUrl('/login');
      });
  }
}
