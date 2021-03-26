import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {CompanyProfileModel} from "../model/company-profile.model";

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private http: HttpClient) { }

  getCompany(name: string): Observable<any> {
    return this.http.get('http://localhost:8083/companies/' + name);
  }

  getAllCompanies(): Observable<any> {
    return this.http.get('http://localhost:8083/companies/all');
  }

  getRating(name: string): Observable<any> {
    return this.http.get('http://localhost:8083/companies/rating/' + name);
  }

  updateCompanyProfile(profile : CompanyProfileModel): Observable<any> {
    return this.http.put('http://localhost:8083/companies/updateProfile', {
      "profileId": profile.profileId,
      "hiredStudents": profile.hiredStudents,
      "reviews": profile.reviews
    });
  }

  addToMailingList(companyId: number, email:string): Observable<any> {
    return this.http.post('http://localhost:8083/companies/addToMailing/' + companyId, {},
      {params: {email: email}})
  }
}
