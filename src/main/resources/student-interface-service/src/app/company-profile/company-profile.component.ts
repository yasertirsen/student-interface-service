import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {CompanyService} from "../shared/company.service";
import {CompanyModel} from "../models/company.model";

@Component({
  selector: 'app-company-profile',
  templateUrl: './company-profile.component.html',
  styleUrls: ['./company-profile.component.css']
})
export class CompanyProfileComponent implements OnInit {
  loading = true;
  companyName: string;
  company: CompanyModel;

  constructor(private companyService: CompanyService, private activatedRoute: ActivatedRoute,
              private router: Router) {
    this.companyName = this.activatedRoute.snapshot.params.name;
    this.companyService.getCompany(this.companyName).subscribe(data =>{
      this.company = data;
      this.companyService.getRating(this.companyName).subscribe(rating => {
        this.company.profile.rating = rating;
      })
      this.loading = false
    })
  }

  ngOnInit(): void {
  }

  onAddReview() {
    this.router.navigateByUrl('/review/' + this.company.name);
  }
}
