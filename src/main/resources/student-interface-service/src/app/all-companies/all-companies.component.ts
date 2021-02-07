import { Component, OnInit } from '@angular/core';
import {CompanyService} from "../shared/company.service";
import {CompanyModel} from "../models/company.model";
import {Router} from "@angular/router";

@Component({
  selector: 'app-all-companies',
  templateUrl: './all-companies.component.html',
  styleUrls: ['./all-companies.component.css']
})
export class AllCompaniesComponent implements OnInit {
  loading = true;
  companies: CompanyModel[] = [];
  rating: number;

  constructor(private companyService: CompanyService, private router: Router) {
    this.companyService.getAllCompanies().subscribe(data => {
      for(let company of data) {
        company.profile.rating = this.getRating(company);
      }
      this.loading = false;
    });
  }

  ngOnInit(): void {
  }

  goToCompanyProfile(name: string) {
    this.router.navigateByUrl('/company/' + name);
  }

  getRating(company: CompanyModel): any {
    this.companyService.getRating(company.name).subscribe(data => {
      company.profile.rating = data;
      this.companies.push(company);
    });
  }
}
