import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {PositionModel} from "../models/position.model";
import {LocalStorageService} from "ngx-webstorage";

@Injectable({
  providedIn: 'root'
})
export class PositionService {
  token: string;

  constructor(private http: HttpClient, private localStorage: LocalStorageService) {
    this.token = this.localStorage.retrieve('token');
  }

  searchJobsApi(location:string, keywords: string): Observable<Array<PositionModel>> {
    return this.http.get<Array<PositionModel>>('http://localhost:8083/searchJobsApi/'+ location + '/' + keywords)
  }

  searchPositions(location:string, keywords: string): Observable<Array<PositionModel>> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    });
    return this.http.get<Array<PositionModel>>('http://localhost:8083/searchPositions/'+ location + '/' + keywords,
      {headers: headers})
  }

  getCompanyPositions(companyId: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    });
    return this.http.get<Array<PositionModel>>('http://localhost:8083/getCompanyPositions/'+ companyId,
      {headers: headers})
  }

  getAllJobs(): Observable<Array<PositionModel>> {{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    });
    return this.http.get<Array<PositionModel>>('http://localhost:8083/getAllPositions/', {headers: headers})
  }}

  getJob(id: number): Observable<PositionModel> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    });
    return this.http.get<PositionModel>('http://localhost:8083/getPosition/' + id, {headers: headers});
  }
}
