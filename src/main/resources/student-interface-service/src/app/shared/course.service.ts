import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {CourseModel} from "../models/course.model";
import {LocalStorageService} from "ngx-webstorage";

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  headers: any;

  constructor(private http: HttpClient, private localStorage: LocalStorageService) {
    this. headers = new HttpHeaders({
      'Content-type': 'application/json',
      'Authorization': `Bearer ${this.localStorage.retrieve('token')}`
    })
  }

  getAllCourses(): Observable<Array<CourseModel>> {
    return this.http.get<Array<CourseModel>>('http://localhost:8083/getCourses')
  }

  addCourse(course: CourseModel): Observable<any> {
    return this.http.post('http://localhost:8083/addCourse', {
      "courseId": course.courseId,
      "name": course.name,
      "university": course.university,
      "level": course.level,
      "url": course.url,
      "modules": course.modules
    },
      {headers : this.headers});
  }
}
