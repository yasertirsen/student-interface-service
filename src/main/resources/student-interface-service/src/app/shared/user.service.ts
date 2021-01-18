import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {UserModel} from "../models/user.model";
import {ProfileModel} from "../models/profile.model";
import {CourseModel} from "../models/course.model";
import {SkillModel} from "../models/skill.model";
import {ProjectModel} from "../models/project.model";
import {LocalStorageService} from "ngx-webstorage";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private localStorage: LocalStorageService) { }

  getCurrentUser(): Observable<any>{
    return this.http.get('http://localhost:8083/currentUser', {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
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
        "resumePath": user.resumePath,
      },
      {
        headers: new HttpHeaders({
          'Content-type': 'application/json',
          'Authorization': `Bearer ${this.localStorage.retrieve('token')}`
        })
      });
  }

  getSkillsNames(profile: ProfileModel): Observable<any>{
    return this.http.post('http://localhost:8083/getSkillsNames',
      {
        "profileId": profile.profileId,
        "course": profile.course,
        "externalSkills": profile.externalSkills,
        "projects": profile.projects,
      },
      {
        headers: new HttpHeaders({
          'Content-type': 'application/json',
          'Authorization': `Bearer ${this.localStorage.retrieve('token')}`
        })
      });
  }

  updateProfile(profile: ProfileModel): Observable<any>{
    return this.http.put('http://localhost:8083/updateProfile',
      {
        "profileId": profile.profileId,
        "course": profile.course,
        "externalSkills": profile.externalSkills,
        "projects": profile.projects,
      },
      {
        headers: new HttpHeaders({
          'Content-type': 'application/json',
          'Authorization': `Bearer ${this.localStorage.retrieve('token')}`
        })
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
        headers: new HttpHeaders({
          'Content-type': 'application/json',
          'Authorization': `Bearer ${this.localStorage.retrieve('token')}`
        })
      });
  }
}
