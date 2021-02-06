import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {LocalStorageService} from "ngx-webstorage";
import {CompanyProfileModel} from "../models/company-profile.model";

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private http: HttpClient , private localStorage: LocalStorageService) { }

  getCompany(name: string): Observable<any> {
    return this.http.get('http://localhost:8083/companies/' + name, {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        'Authorization': `Bearer ${this.localStorage.retrieve('token')}`
      })
    });
  }

  getAllCompanies(): Observable<any> {
    return this.http.get('http://localhost:8083/companies/all', {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        'Authorization': `Bearer ${this.localStorage.retrieve('token')}`
      })
    });
  }

  getRating(name: string): Observable<any> {
    return this.http.get('http://localhost:8083/companies/rating/' + name, {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        'Authorization': `Bearer ${this.localStorage.retrieve('token')}`
      })
    });
  }

  updateCompanyProfile(profile : CompanyProfileModel): Observable<any> {
    return this.http.get('', {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        'Authorization': `Bearer ${this.localStorage.retrieve('token')}`
      })
    });
  }
}
