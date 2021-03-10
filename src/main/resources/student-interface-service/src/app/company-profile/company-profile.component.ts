import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {CompanyService} from "../shared/company.service";
import {CompanyModel} from "../models/company.model";
import {PositionModel} from "../models/position.model";
import {PositionService} from "../shared/position.service";
import {UserService} from "../shared/user.service";
import {ReviewModel} from "../models/review.model";
import {LocalStorageService} from "ngx-webstorage";

@Component({
  selector: 'app-company-profile',
  templateUrl: './company-profile.component.html',
  styleUrls: ['./company-profile.component.css']
})
export class CompanyProfileComponent implements OnInit {
  loading = true;
  companyName: string;
  company: CompanyModel;
  positions: PositionModel[];
  reviews = new Map();

  constructor(private companyService: CompanyService, private activatedRoute: ActivatedRoute,
              private router: Router, private positionService: PositionService, private userService: UserService,
              private localStorage: LocalStorageService) {
    this.companyName = this.activatedRoute.snapshot.params.name;
    this.companyService.getCompany(this.companyName).subscribe(data =>{
      this.company = data;
      for(let review of this.company.profile.reviews) {
        this.userService.getUserById(review.studentId).subscribe( poster => {
          this.reviews.set(poster, review);
        });
      }
      this.companyService.getRating(this.companyName).subscribe(rating => {
        this.company.profile.rating = Number((Math.round(rating * 100) / 100).toFixed(2));
        this.positionService.getCompanyPositions(this.company.companyId).subscribe(positions => {
          this.positions = positions;
          this.loading = false
        });
      });
    })
  }

  ngOnInit(): void {
  }

  onAddReview() {
    this.router.navigateByUrl('/review/' + this.company.name);
  }

  onProfile(userId: number) {
    this.router.navigateByUrl('/profile/' + userId);
  }

  notCurrentUser(email: string) {
    return email !== this.localStorage.retrieve('email')

  }
}
