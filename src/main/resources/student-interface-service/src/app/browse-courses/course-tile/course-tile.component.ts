import {Component, Input, OnInit} from '@angular/core';
import {CourseModel} from "../../models/course.model";
import {MatDialog} from "@angular/material/dialog";
import {LocalStorageService} from "ngx-webstorage";
import {UserService} from "../../shared/user.service";
import {UserModel} from "../../models/user.model";
import {AddLinkedinDialogComponent} from "../../home/add-linkedin-dialog/add-linkedin-dialog.component";
import {CourseDialogComponent} from "../course-dialog/course-dialog.component";
import {Router} from "@angular/router";
import {SkillModel} from "../../models/skill.model";

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
              private router: Router) {
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
        this.router.navigateByUrl('/home',
          {queryParams: {assigned: 'true'}});
      }
    });
  }

  updateUser(): void {
    this.userService.addSkills(this.user.profile).subscribe();
  }
}
