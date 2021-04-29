import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
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

  searchSalaries(keywords: string, location: string): Observable<any> {
    return this.http.get('http://localhost:8083/searchSalary/' + keywords + '/' + location);
  }

  getCompanyPositions(companyId: number): Observable<any> {
    return this.http.get<Array<PositionModel>>('http://localhost:8083/getCompanyPositions/'+ companyId)
  }

  getAllJobs(): Observable<Array<PositionModel>> {
    return this.http.get<Array<PositionModel>>('http://localhost:8083/getAllPositions/')
  }

  getRecommendedJobs(email: string): Observable<any> {
    return this.http.get('http://localhost:8083/positions/recommend',
      {params: {email: email}});
  }

  // getRecommendations(email: string): any {
  //   if(!!localStorage.getItem('recommendedJobs')) {
  //     this.http.get('http://localhost:8083/positions/recommend',
  //       {params: {email: email}}).subscribe(data => {
  //       localStorage.setItem('recommendedJobs', JSON.stringify(data));
  //       return data;
  //     });
  //   }
  //   else {
  //     return JSON.parse(localStorage.getItem('recommendedJobs'));
  //   }
  // }


  getJob(id: number): Observable<PositionModel> {
    return this.http.get<PositionModel>('http://localhost:8083/getPosition/' + id);
  }

  apply(application: ApplicationModel): Observable<any> {
    return this.http.post('http://localhost:8083/apply', application,
      {responseType: 'blob'});
  }

  updateJob(position: PositionModel): Observable<any>{
    return this.http.put('http://localhost:8083/positions/update', position);
  }

  getUserApplicationsStats(email: string): Observable<any> {
    return this.http.get('http://localhost:8083/applicationsStats',
      {params: {email: email}});
  }

  updateApplication(application: ApplicationModel): Observable<any> {
    return this.http.put('http://localhost:8083/application/update', application);
  }
}
