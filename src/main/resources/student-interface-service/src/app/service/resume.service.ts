import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {UserModel} from "../model/user.model";
import {ResumeModel} from "../model/resume.model";

@Injectable({
  providedIn: 'root'
})
export class ResumeService {

  constructor(private http: HttpClient) {
  }

  generateDynamicCv(user: UserModel, companyName: string, jobTitle: string): any {
    return this.http.post('http://localhost:8083/generateDynamicCv/' + companyName + '/' + jobTitle, user);
  }

  getCv(username: string): Observable<any> {
    return this.http.get('http://localhost:8083/getCv/' + username, {
      responseType: 'blob'
    });
  }

  getUserCvs(userId: number): Observable<any> {
    return this.http.get('http://localhost:8083/getAllCvs/' + userId);
  }

  uploadCv(cvData: FormData, userId: number): Observable<any> {
    return this.http.post('http://localhost:8083/upload/cv/' + userId,
      cvData);
  }

  updateCv(cv: ResumeModel): Observable<any> {
    return this.http.put('http://localhost:8083/updateCv/',
      {
        "resumeId": cv.resumeId,
        "name": cv.name,
        "data": cv.data,
        "studentId": cv.studentId
      });
  }

}
