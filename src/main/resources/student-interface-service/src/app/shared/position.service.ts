import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {PositionModel} from "../models/position.model";
import {LocalStorageService} from "ngx-webstorage";
import {ApplicationModel} from "../models/application.model";
import {ResumeModel} from "../models/ResumeModel";

@Injectable({
  providedIn: 'root'
})
export class PositionService {
  token: string;
  headers;

  constructor(private http: HttpClient, private localStorage: LocalStorageService) {
    this.token = this.localStorage.retrieve('token');
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    });
  }

  searchJobsApi(location:string, keywords: string): Observable<Array<PositionModel>> {
    return this.http.get<Array<PositionModel>>('http://localhost:8083/searchJobsApi/'+ location + '/' + keywords)
  }

  searchPositions(location:string, keywords: string): Observable<Array<PositionModel>> {
    return this.http.get<Array<PositionModel>>('http://localhost:8083/searchPositions/'+ location + '/' + keywords,
      {headers: this.headers})
  }

  getCompanyPositions(companyId: number): Observable<any> {
    return this.http.get<Array<PositionModel>>('http://localhost:8083/getCompanyPositions/'+ companyId,
      {headers: this.headers})
  }

  getAllJobs(): Observable<Array<PositionModel>> {{
    return this.http.get<Array<PositionModel>>('http://localhost:8083/getAllPositions/', {headers: this.headers})
  }}

  getJob(id: number): Observable<PositionModel> {
    return this.http.get<PositionModel>('http://localhost:8083/getPosition/' + id, {headers: this.headers});
  }

  apply(application: ApplicationModel): Observable<any> {
    return this.http.post('http://localhost:8083/apply',
      {
        "fullName": application.fullName,
        "email": application.email,
        "resume": application.resume,
        "positionId": application.positionId,
    }, {headers: this.headers, responseType: 'blob'});
  }
}
