import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {UserModel} from "../models/user.model";
import {ProfileModel} from "../models/profile.model";
import {CourseModel} from "../models/course.model";
import {SkillModel} from "../models/skill.model";
import {ProjectModel} from "../models/project.model";
import {LocalStorageService} from "ngx-webstorage";
import {ExperienceModel} from "../models/experience.model";
import {LoginRequest} from "../models/login-request-payload";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  headers: any;

  constructor(private http: HttpClient, private localStorage: LocalStorageService) {
    this.headers = new HttpHeaders({
      'Authorization': `Bearer ${this.localStorage.retrieve('token')}`
    })
  }

  login(user: LoginRequest): Observable<any> {
    return this.http.post('http://localhost:8083/login',
      {"email": user.email,
            "password": user.password});
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
      headers: this.headers
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
