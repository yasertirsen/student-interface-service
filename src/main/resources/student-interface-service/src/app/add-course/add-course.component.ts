import { Component, OnInit } from '@angular/core';
import {CourseModel} from "../models/course.model";
import {ModuleModel} from "../models/module.model";
import {FormArray, FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {AddProjectDialogComponent} from "../profile/add-project-dialog/add-project-dialog.component";
import {AddModuleDialogComponent} from "./add-module-dialog/add-module-dialog.component";
import {UserService} from "../shared/user.service";
import {UserModel} from "../models/user.model";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CourseService} from "../shared/course.service";
import {Observable} from "rxjs";
import {map, startWith} from "rxjs/operators";

@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.css']
})
export class AddCourseComponent implements OnInit {
  loading = true;
  user: UserModel;
  course: CourseModel = {
    courseId: 0,
    name: null,
    university: null,
    level: null,
    url: null,
    modules: []
  }
  filteredOptions: Observable<string[]>;
  myControl = new FormControl();
  unis: string[] = [];
  constructor(private dialog: MatDialog, private userService: UserService, private router: Router,
              private _snackBar: MatSnackBar, private courseService: CourseService) {
    this.userService.getCurrentUser().subscribe(user => {
      this.user = user;
    });
    this.courseService.getAllCourses().subscribe(data => {
      for(let course of data) {
        if(!this.unis.includes(course.university))
          this.unis.push(course.university);
      }
      console.log(this.unis);
      this.loading = false;
    });
  }

  onAddModule() {
    const moduleDialog =
      this.dialog.open(AddModuleDialogComponent, {
        width: '500px'
      });
    moduleDialog.afterClosed().subscribe(result => {
      if(result !== undefined) {
        this.course.modules.push(result);
      }
    });
  }

  onAddCourse() {
    this.courseService.addCourse(this.course).subscribe(data => {
      this.user.profile.course = data
        this.updateUser();
        this.router.navigateByUrl('/home');
    },
      error => {
      console.log(error);
        this._snackBar.open('An error has occurred', 'Close', {
          duration: 3000,
        });
      });
  }

  updateUser(): void {
    this.userService.updateProfile(this.user.profile).subscribe(data => {
      this._snackBar.open('Course added successfully', 'Close', {
        duration: 3000,
      });
    }, error => {
       console.log(error);
      this._snackBar.open('An error has occurred', 'Close', {
        duration: 3000,
      });
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.unis.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  ngOnInit(): void {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }
}
