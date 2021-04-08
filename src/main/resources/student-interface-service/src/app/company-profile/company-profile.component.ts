import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {CompanyService} from "../service/company.service";
import {PositionModel} from "../model/position.model";
import {PositionService} from "../service/position.service";
import {CompanyWrapperModel} from "../model/company-wrapper.model";
import {forkJoin} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {GetUpdatesDialogComponent} from "./get-updates-dialog/get-updates-dialog.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UserModel} from "../model/user.model";
import {UserService} from "../service/user.service";
import {HiredStudentsDialogComponent} from "./hired-students-dialog/hired-students-dialog.component";

@Component({
  selector: 'app-company-profile',
  templateUrl: './company-profile.component.html',
  styleUrls: ['./company-profile.component.css']
})
export class CompanyProfileComponent implements OnInit {
  loading = true;
  user: UserModel;
  company: CompanyWrapperModel = {
    company: null,
    users: []
  };
  positions: PositionModel[];
  usersMap = new Map<number, string>();
  hiredStudents: UserModel[];

  constructor(private companyService: CompanyService, private activatedRoute: ActivatedRoute,
              private router: Router, private positionService: PositionService,
              private dialog: MatDialog, private _snackBar: MatSnackBar,
              private userService: UserService) {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit(): void {
    this._getNameFromUrl();
  }

  onAddReview() {
    this.router.navigateByUrl('/review/' + this.company.company.name);
  }

  private _getNameFromUrl() {
    this.activatedRoute.params.subscribe(p => {
      this.getDataForCompanyAndRating(p.name);
    });
  }

  getDataForCompanyAndRating(name: string) {
    let getCompany = this.companyService.getCompany(name);
    let getRating = this.companyService.getRating(name);
    let getHiredStudents = this.userService.getHiredStudentsByUni(name, this.user.studentId)

    forkJoin([getCompany, getRating, getHiredStudents]).subscribe(results => {
      this.company = (results[0] as CompanyWrapperModel);
      this.company.users.forEach(u => this.usersMap.set(u.studentId, u.firstName));
      const rating = (results[1] as number);
      this.company.company.profile.rating = Number((Math.round(rating * 100) / 100).toFixed(2));
      this.positionService.getCompanyPositions(this.company.company.companyId).subscribe(positions => {
        this.positions = positions;
        this.loading = false
      });
      this.hiredStudents = results[2];
    }, error1 => {
      this.loading = false;
      console.log(error1);
    });
  }

  onGetUpdates() {
    const confirmDialog =
      this.dialog.open(GetUpdatesDialogComponent, {
        width: '500px'
      });
    confirmDialog.afterClosed().subscribe(result => {
      if (result) {
        this.companyService.addToMailingList(this.company.company.companyId, this.user.email).subscribe(data => {
            this._snackBar.open('Company notifications is ON', 'Close', {duration: 3000});
          },
          error => {
            console.log(error);
          });
      }
    });
  }

  onViewHired(): void {
    this.dialog.open(HiredStudentsDialogComponent, {
      width: '500px',
      data: {hiredStudents: this.hiredStudents}
    });
  }
}
