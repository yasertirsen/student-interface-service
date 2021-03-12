import { Component, OnInit } from '@angular/core';
import {CompanyModel} from "../models/company.model";
import {CompanyService} from "../services/company.service";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../services/user.service";
import {UserModel} from "../models/user.model";
import {ReviewModel} from "../models/review.model";
import {MatSelectChange} from "@angular/material/select";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent implements OnInit {
  loading = true;
  companyName: string;
  company: CompanyModel;
  user: UserModel;
  review: ReviewModel = {
    content: null,
    hired: null,
    interviewed: null,
    questions: null,
    reviewId: null,
    studentId: null,
    type: null,
    profileId: null
  };

  constructor(private userService: UserService, private companyService: CompanyService,
              private activatedRoute: ActivatedRoute, private _snackBar: MatSnackBar,
              private router: Router) {
    this.companyName = this.activatedRoute.snapshot.params.name;
    this.companyService.getCompany(this.companyName).subscribe(data => {
      this.company = data.company;
      this.userService.getCurrentUser().subscribe(user => {
        this.user = user;
        this.review.studentId = this.user.studentId;
        this.review.profileId = this.company.profile.profileId;
        this.loading = false;
      });
    });
  }

  ngOnInit(): void {
  }

  onSubmit() {
    this.company.profile.reviews.push(this.review);
    this.companyService.updateCompanyProfile(this.company.profile).subscribe(data => {
      this._snackBar.open('Review posted successfully', 'Close', {
        duration: 5000
      });
    }, error => {
      console.log(error);
    });

    this.router.navigateByUrl('/companies');
  }

  selectedType(event: MatSelectChange) {
    this.review.type = event.value;
  }

  selectedHired(event: MatSelectChange) {
    if(event.value === 'H') {
      this.review.hired = true;
      this.review.interviewed = true;
    }
    else {
      this.review.hired = false;
      this.review.interviewed = true;
    }
  }
}
