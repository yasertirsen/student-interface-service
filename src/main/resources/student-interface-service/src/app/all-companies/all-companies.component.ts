import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {CompanyService} from "../service/company.service";
import {CompanyModel} from "../model/company.model";
import {Router} from "@angular/router";
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {Observable} from "rxjs";

@Component({
  selector: 'app-all-companies',
  templateUrl: './all-companies.component.html',
  styleUrls: ['./all-companies.component.css']
})
export class AllCompaniesComponent implements OnInit {
  loading = true;
  companies: CompanyModel[] = [];
  datasource: MatTableDataSource<CompanyModel>;
  obs: Observable<any>;
  private paginator: MatPaginator;

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }

  setDataSourceAttributes() {
    this.datasource.paginator = this.paginator;
  }

  constructor(private companyService: CompanyService, private router: Router,
              private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.companyService.getAllCompanies().subscribe(data => {
      this.datasource = new MatTableDataSource<CompanyModel>(this.getRating(data));
      this.changeDetectorRef.detectChanges();
      this.obs = this.datasource.connect();
      this.loading = false;
    });
  }

  goToCompanyProfile(name: string) {
    this.router.navigateByUrl('/company/' + name);
  }

  getRating(companies: CompanyModel[]): any {
    for(let company of companies) {
      this.companyService.getRating(company.name).subscribe(data => {
        company.profile.rating = Number((Math.round(data * 100) / 100).toFixed(2));
      });
    }
    return companies;
  }
}
