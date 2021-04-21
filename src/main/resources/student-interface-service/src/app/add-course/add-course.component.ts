import {Component, OnInit} from '@angular/core';
import {CourseModel} from "../model/course.model";
import {FormControl} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {AddModuleDialogComponent} from "./add-module-dialog/add-module-dialog.component";
import {UserService} from "../service/user.service";
import {UserModel} from "../model/user.model";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CourseService} from "../service/course.service";
import {Observable} from "rxjs";
import {map, startWith} from "rxjs/operators";
import {CourseDialogComponent} from "../browse-courses/course-dialog/course-dialog.component";

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
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    this.courseService.getAllCourses().subscribe(data => {
      for(let course of data) {
        if(!this.unis.includes(course.university))
          this.unis.push(course.university);
      }
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
    this.courseService.addCourse(this.course).subscribe(course => {
      console.log(course);
        const dialogRef =
          this.dialog.open(CourseDialogComponent, {
            width: '500px',
            data: {
              course,
              start: null,
              end: null,
              averageGrade: 0
            }
          });

        dialogRef.afterClosed().subscribe(result => {
          if(!result.start || !result.end || !result.averageGrade) {
            this._snackBar.open('Please enter starting graduating dates and average grade', 'Close', {
              duration: 5000,
            });
          }
          else {
            this.user.profile.externalSkills = [];
            for(let module of course.modules) {
              if(!!module.skill && !!module.skill.skillName)
                this.user.profile.externalSkills.push(module.skill);
            }
            this.user.profile.course = course;
            this.user.profile.startCourse = result.start;
            this.user.profile.endCourse = result.end;
            this.user.profile.averageGrade = result.averageGrade;
            this.updateUser();
            this.router.navigateByUrl('/home');
            this._snackBar.open('Course assigned successfully', 'Close', {
              duration: 5000,
            });
          }
        });
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
      this.user.profile = data;
      localStorage.setItem('currentUser', JSON.stringify(this.user));
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
