import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {UserModel} from "../models/user.model";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getCurrentUser(token: string): Observable<any>{
    return this.http.get('http://localhost:8083/currentUser', {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    });
  }

  updateUser(user: UserModel): Observable<UserModel>{
    return this.http.put<UserModel>('http://localhost:8083/update',
      {
        "studentId": user.studentId,
        "firstName": user.firstName,
        "surname": user.surname,
        "password": user.password,
        "email": user.email,
        "username": user.username,
        "phone": user.phone,
        "socialUrl": user.socialUrl,
        "created": user.created,
        "enabled": user.enabled,
        "role": user.role,
        "authorities": user.authorities,
        "isLocked": user.isLocked,
        "profile": user.profile,
        "resumePath": user.resumePath
      });
  }
}
