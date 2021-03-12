import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {LocalStorageService} from "ngx-webstorage";
import {Observable} from "rxjs";
import {UserModel} from "../models/user.model";
import {ResumeModel} from "../models/ResumeModel";

@Injectable({
  providedIn: 'root'
})
export class ResumeService {
  token: string;
  headers: any;

  constructor(private http: HttpClient, private localStorage: LocalStorageService) {
    this.token = this.localStorage.retrieve('token');
    this.headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
  }

  generateDynamicCv(user: UserModel): any {
    return this.http.post('http://localhost:8083/generateDynamicCv/', user, { headers: this.headers});
  }

  getCv(username: string): Observable<any> {
    return this.http.get('http://localhost:8083/getCv/' + username, {
      headers: this.headers, responseType: 'blob'
    });
  }

  uploadCv(cvData: FormData, userId: number): Observable<any> {
    return this.http.post('http://localhost:8083/upload/cv/' + userId,
      cvData,
      {
        headers: this.headers,
        responseType: 'blob'
      });
  }

}
