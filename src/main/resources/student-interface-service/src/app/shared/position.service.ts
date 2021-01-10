import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {PositionModel} from "../models/position.model";
import {LocalStorageService} from "ngx-webstorage";

@Injectable({
  providedIn: 'root'
})
export class PositionService {

  constructor(private http: HttpClient, private localStorage: LocalStorageService) { }

  searchJobsApi(location:string, keywords: string): Observable<Array<PositionModel>> {
    return this.http.get<Array<PositionModel>>('http://localhost:8083/searchJobsApi/'+ location + '/' + keywords)
  }

  getAllJobs(token): Observable<Array<PositionModel>> {{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<Array<PositionModel>>('http://localhost:8083/getAllPositions/', {headers: headers})
  }}

  getJob(id: number): Observable<PositionModel> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.localStorage.retrieve('token')}`
    });
    return this.http.get<PositionModel>('http://localhost:8083/getPosition/' + id, {headers: headers});
  }
}
