import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {UserModel} from "../models/user.model";
import {ProfileModel} from "../models/profile.model";
import {LocalStorageService} from "ngx-webstorage";
import {LoginRequest} from "../models/login-request-payload";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  headers: any;

  constructor(private http: HttpClient, private localStorage: LocalStorageService) {
    this.headers = new HttpHeaders({
      'Authorization': `Bearer ${this.localStorage.retrieve('token')}`
    });
  }

  login(details: LoginRequest): Observable<any> {
    return this.http.post<any>('http://localhost:8083/login',
      {"email": details.email,
            "password": details.password})
      .pipe(map(user => {
              if(user && user.token) {
                localStorage.setItem('currentUser', JSON.stringify(user));
                this.localStorage.store('token', user.token);
                this.localStorage.store('email', user.email);
                this.localStorage.store('expiresIn', user.expiresIn);
              }
              return user;
    }));
  }

  logout() {
    localStorage.removeItem('currentUser');
  }

  getCurrentUser(): Observable<any>{
    return this.http.get('http://localhost:8083/currentUser', {
      headers: this.headers
    });
  }

  getUserById(userId: number): Observable<any> {
    return this.http.get('http://localhost:8083/getUserById/' + userId,
      {headers: this.headers});
  }

  getAllSkills(): Observable<any> {
    return this.http.get('http://localhost:8083/getAllSkills', {
      headers: this.headers
    });
  }

  getUserAvatar(userId: number): Observable<any>{
    return this.http.get('http://localhost:8083/getStudentAvatar/' + userId, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.localStorage.retrieve('token')}`
      })
    });
  }

  updateUser(user: UserModel): Observable<any>{
    return this.http.put('http://localhost:8083/update',
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
      },
      {
        headers: this.headers
      });
  }

  getSkillsNames(profile: ProfileModel): Observable<any>{
    return this.http.post('http://localhost:8083/getSkillsNames',
      {
        "profileId": profile.profileId,
        "course": profile.course,
        "bio": profile.bio,
        "externalSkills": profile.externalSkills,
        "projects": profile.projects,
        "experiences": profile.experiences,
        "averageGrade": profile.averageGrade,
        "startCourse": profile.startCourse,
        "endCourse": profile.endCourse,
        "age": profile.age,
        "race": profile.race,
        "gender": profile.gender
      },
      {
        headers: this.headers
      });
  }

  updateProfile(profile: ProfileModel): Observable<any>{
    return this.http.put('http://localhost:8083/updateProfile',
      {
        "profileId": profile.profileId,
        "course": profile.course,
        "bio": profile.bio,
        "externalSkills": profile.externalSkills,
        "projects": profile.projects,
        "experiences": profile.experiences,
        "averageGrade": profile.averageGrade,
        "startCourse": profile.startCourse,
        "endCourse": profile.endCourse,
        "age": profile.age,
        "race": profile.race,
        "gender": profile.gender
      },
      {
        headers: this.headers
      });
  }

  addSkills(profile: ProfileModel): Observable<any>{
    return this.http.put('http://localhost:8083/addSkills',
      {
        "profileId": profile.profileId,
        "course": profile.course,
        "externalSkills": profile.externalSkills,
        "projects": profile.projects,
      },
      {
        headers: this.headers
      });
  }

  uploadImage(imageData: FormData, userId: number): Observable<any> {
    return this.http.post('http://localhost:8083/upload/image/' + userId,
      imageData,
      {
        headers: this.headers
      });
  }
}
