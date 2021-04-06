import {ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {CourseModel} from "../../model/course.model";
import {MatDialog} from "@angular/material/dialog";
import {UserService} from "../../service/user.service";
import {UserModel} from "../../model/user.model";
import {CourseDialogComponent} from "../course-dialog/course-dialog.component";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatTableDataSource} from "@angular/material/table";
import {Observable} from "rxjs";
import {MatPaginator} from "@angular/material/paginator";

@Component({
  selector: 'app-course-tile',
  templateUrl: './course-tile.component.html',
  styleUrls: ['./course-tile.component.css']
})
export class CourseTileComponent implements OnInit, OnDestroy {

  @Input() courses: CourseModel[];
  datasource: MatTableDataSource<CourseModel>;
  obs: Observable<any>;
  user: UserModel;
  course: CourseModel;

  private paginator: MatPaginator;

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }

  setDataSourceAttributes() {
    this.datasource.paginator = this.paginator;
  }

  constructor(private dialog: MatDialog, private userService: UserService,
              private router: Router, private _snackBar: MatSnackBar,
              private changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    this.course = this.user.profile.course;
    this.datasource = new MatTableDataSource<CourseModel>(this.courses);
    this.changeDetectorRef.detectChanges();
    this.obs = this.datasource.connect();
  }

  ngOnDestroy() {
    if (this.datasource) {
      this.datasource.disconnect();
    }
  }

  openDialog(course: CourseModel): void {
    const dialogRef =
      this.dialog.open(CourseDialogComponent, {
        width: '500px',
        data: {
          course,
          start: null,
          end: null
        }
      });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if(result.start === null || result.end === null) {
        this._snackBar.open('Please enter starting graduating dates', 'Close', {
          duration: 5000,
        });
      }
      else {
        this.user.profile.externalSkills = [];
        for(let module of course.modules) {
          if(module.skill !== null && module.skill.skillName !== null)
            this.user.profile.externalSkills.push(module.skill);
        }
        this.user.profile.course = course;
        this.user.profile.startCourse = result.start;
        this.user.profile.endCourse = result.end;
        this.updateUser();
        this.redirectTo('/home');
        this._snackBar.open('Course assigned successfully', 'Close', {
          duration: 5000,
        });
      }
    });
  }

  updateUser(): void {
    this.userService.updateProfile(this.user.profile).subscribe(data => {
      this.user.profile = data;
      localStorage.setItem('currentUser', JSON.stringify(this.user));
    });
  }

  redirectTo(uri:string){
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
      this.router.navigate([uri]));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.datasource.filter = filterValue.trim().toLowerCase();
  }

}
