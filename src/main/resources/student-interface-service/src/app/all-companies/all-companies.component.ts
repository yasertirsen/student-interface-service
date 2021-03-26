import { Component, OnInit } from '@angular/core';
import {CompanyService} from "../service/company.service";
import {CompanyModel} from "../model/company.model";
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
        this.getRating(company);
      }
      this.loading = false;
    });
  }

  ngOnInit(): void {
  }

  goToCompanyProfile(name: string) {
    this.router.navigateByUrl('/company/' + name);
  }

  getRating(company: CompanyModel): void {
    this.companyService.getRating(company.name).subscribe(data => {
      company.profile.rating = Number((Math.round(data * 100) / 100).toFixed(2));
      this.companies.push(company);
    });
  }
}
