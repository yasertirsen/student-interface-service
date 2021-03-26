import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {PositionModel} from "../model/position.model";
import {ApplicationModel} from "../model/application.model";

@Injectable({
  providedIn: 'root'
})
export class PositionService {

  constructor(private http: HttpClient) {
  }

  searchJobsApi(location:string, keywords: string): Observable<Array<PositionModel>> {
    return this.http.get<Array<PositionModel>>('http://localhost:8083/searchJobsApi/'+ location + '/' + keywords)
  }

  searchPositions(location:string, keywords: string): Observable<Array<PositionModel>> {
    return this.http.get<Array<PositionModel>>('http://localhost:8083/searchPositions/'+ location + '/' + keywords)
  }

  getCompanyPositions(companyId: number): Observable<any> {
    return this.http.get<Array<PositionModel>>('http://localhost:8083/getCompanyPositions/'+ companyId)
  }

  getAllJobs(): Observable<Array<PositionModel>> {{
    return this.http.get<Array<PositionModel>>('http://localhost:8083/getAllPositions/')
  }}

  getRecommendedJobs(email: string): Observable<any> {{
    return this.http.get('http://localhost:8083/positions/recommend',
      {params: {email: email}});}
  }

  getJob(id: number): Observable<PositionModel> {
    return this.http.get<PositionModel>('http://localhost:8083/getPosition/' + id);
  }

  apply(application: ApplicationModel): Observable<any> {
    return this.http.post('http://localhost:8083/apply',
      {
        "fullName": application.fullName,
        "email": application.email,
        "resume": application.resume,
        "positionId": application.positionId,
    }, {responseType: 'blob'});
  }

  updateJob(position: PositionModel): Observable<any>{
    return this.http.put('http://localhost:8083/positions/update',
      {
        "positionId": position.positionId,
        "title": position.title,
        "description": position.description,
        "location": position.location,
        "date": position.date,
        "salary": position.salary,
        "clicks": position.clicks,
        "priority": position.priority,
        "archive": position.archive,
        "company": position.company,
        "requirements": position.requirements
      });
  }
}
