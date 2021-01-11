import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {LocalStorageService} from "ngx-webstorage";
import {Observable} from "rxjs";
import {UserModel} from "../models/user.model";

@Injectable({
  providedIn: 'root'
})
export class ResumeService {
  token: string;

  constructor(private http: HttpClient, private localStorage: LocalStorageService) {
    this.token = this.localStorage.retrieve('token');
  }

  generateDynamicCv(user: UserModel): any {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    });
    // @ts-ignore
    return this.http.post<Blob>('http://localhost:8083/generateDynamicCv/', user, { headers: headers, responseType: 'blob' });
  }

}
