import { Component, OnInit } from '@angular/core';
import {UserModel} from "../models/user.model";
import {UserService} from "../services/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {LocalStorageService} from "ngx-webstorage";

@Component({
  selector: 'app-alumni-profile',
  templateUrl: './alumni-profile.component.html',
  styleUrls: ['./alumni-profile.component.css']
})
export class AlumniProfileComponent implements OnInit {
  loading = true;
  user: UserModel;
  retrievedImage: any = null;
  base64Data: any;

  constructor(private userService: UserService, private activatedRoute: ActivatedRoute,
              private localStorage: LocalStorageService, private router: Router) {
    this.userService.getUserById(this.activatedRoute.snapshot.params.userId).subscribe(data => {
      this.user = data;
      this.userService.getUserAvatar(this.user.studentId).subscribe(image => {
        if(image.data !== null) {
          this.base64Data = image.data;
          this.retrievedImage = 'data:image/jpeg;base64,' + this.base64Data;
          this.loading = false;
        }
      });
    });
  }

  ngOnInit(): void {
  }

}
