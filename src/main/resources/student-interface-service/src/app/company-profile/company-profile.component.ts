import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {CompanyService} from "../shared/company.service";
import {CompanyModel} from "../models/company.model";
import {PositionModel} from "../models/position.model";
import {PositionService} from "../shared/position.service";
import {UserService} from "../shared/user.service";
import {ReviewModel} from "../models/review.model";
import {LocalStorageService} from "ngx-webstorage";
import {CompanyWrapperModel} from "../models/companyWrapper.model";
import {forkJoin} from "rxjs";

@Component({
  selector: 'app-company-profile',
  templateUrl: './company-profile.component.html',
  styleUrls: ['./company-profile.component.css']
})
export class CompanyProfileComponent implements OnInit {
  loading = true;
  companyName: string;
  company: CompanyWrapperModel = {
    company: null,
    users: []
  };
  positions: PositionModel[];
  usersMap = new Map<number, string>();

  constructor(private companyService: CompanyService, private activatedRoute: ActivatedRoute,
              private router: Router, private positionService: PositionService, private userService: UserService,
              private localStorage: LocalStorageService) {}

  ngOnInit(): void {
    this._getIdFromUrl();
  }

  onAddReview() {
    this.router.navigateByUrl('/review/' + this.company.company.name);
  }

  private _getIdFromUrl() {
    this.activatedRoute.params.subscribe(p => {
      this.getDataForCompanyAndRating(p.name);
    });
  }

  getDataForCompanyAndRating(name: string) {
    let getCompany = this.companyService.getCompany(name);
    let getRating = this.companyService.getRating(name);

    forkJoin([getCompany, getRating]).subscribe(results => {
      this.company = (results[0] as CompanyWrapperModel);
      this.company.users.forEach(u => this.usersMap.set(u.studentId, u.firstName));
      console.log(this.company);
      const rating = (results[1] as number);
      this.company.company.profile.rating = Number((Math.round(rating * 100) / 100).toFixed(2))
      this.positionService.getCompanyPositions(this.company.company.companyId).subscribe(positions => {
        this.positions = positions;
        this.loading = false
      });
    }, error1 => {
      this.loading = false;
      console.log(error1);
    });
  }
}
