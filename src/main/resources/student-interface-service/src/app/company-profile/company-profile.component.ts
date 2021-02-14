import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {CompanyService} from "../shared/company.service";
import {CompanyModel} from "../models/company.model";
import {PositionModel} from "../models/position.model";
import {PositionService} from "../shared/position.service";

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

  constructor(private companyService: CompanyService, private activatedRoute: ActivatedRoute,
              private router: Router, private positionService: PositionService) {
    this.companyName = this.activatedRoute.snapshot.params.name;
    this.companyService.getCompany(this.companyName).subscribe(data =>{
      this.company = data;
      this.companyService.getRating(this.companyName).subscribe(rating => {
        this.company.profile.rating = rating;
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
}
