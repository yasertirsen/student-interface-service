import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {LocalStorageService} from "ngx-webstorage";
import {Observable} from "rxjs";
import {UserModel} from "../model/user.model";
import {ResumeModel} from "../model/ResumeModel";

@Injectable({
  providedIn: 'root'
})
export class ResumeService {

  constructor(private http: HttpClient) {
  }

  generateDynamicCv(user: UserModel): any {
    return this.http.post('http://localhost:8083/generateDynamicCv/', user);
  }

  getCv(username: string): Observable<any> {
    return this.http.get('http://localhost:8083/getCv/' + username, {
      responseType: 'blob'
    });
  }

  uploadCv(cvData: FormData, userId: number): Observable<any> {
    return this.http.post('http://localhost:8083/upload/cv/' + userId,
      cvData,
      {
        responseType: 'blob'
      });
  }

}
