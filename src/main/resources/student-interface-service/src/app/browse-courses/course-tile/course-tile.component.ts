import {Component, Input, OnInit} from '@angular/core';
import {CourseModel} from "../../models/course.model";
import {MatDialog} from "@angular/material/dialog";
import {LocalStorageService} from "ngx-webstorage";
import {UserService} from "../../shared/user.service";
import {UserModel} from "../../models/user.model";
import {CourseDialogComponent} from "../course-dialog/course-dialog.component";
import {Router} from "@angular/router";
import {SkillModel} from "../../models/skill.model";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-course-tile',
  templateUrl: './course-tile.component.html',
  styleUrls: ['./course-tile.component.css']
})
export class CourseTileComponent implements OnInit {

  @Input() courses: CourseModel[];
  user: UserModel;
  course: CourseModel;
  skill: SkillModel;
  isError: boolean;

  constructor(private dialog: MatDialog, private localStorage: LocalStorageService, private userService: UserService,
              private router: Router, private _snackBar: MatSnackBar) {
    this.userService.getCurrentUser().subscribe(user => {
      this.user = user;
      this.course = this.user.profile.course
    })
  }

  ngOnInit(): void {
  }

  openDialog(course: CourseModel): void {
    const dialogRef =
      this.dialog.open(CourseDialogComponent, {
        width: '750px',
        data: {
          course: course
        }
      });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.user.profile.course = course;
        this.updateUser();
        this.redirectTo('/home');
        this._snackBar.open('Course assigned successfully', 'Close', {
          duration: 5000,
        });
      }
    });
  }

  updateUser(): void {
    this.userService.addSkills(this.user.profile).subscribe();
  }

  redirectTo(uri:string){
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
      this.router.navigate([uri]));
  }
}
