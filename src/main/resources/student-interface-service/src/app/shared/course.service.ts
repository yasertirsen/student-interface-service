import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {CourseModel} from "../models/course.model";

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  constructor(private http: HttpClient) { }

  getAllCourses(): Observable<Array<CourseModel>> {
    return this.http.get<Array<CourseModel>>('http://localhost:8082/api/courses/all')
  }
}
