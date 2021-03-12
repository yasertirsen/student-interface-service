import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {RegisterComponent} from "./register/register.component";
import {LoginComponent} from "./login/login.component";
import {NotFoundComponent} from "./not-found/not-found.component";
import {HomeComponent} from "./home/home.component";
import {JobSearchComponent} from "./job-search/job-search.component";
import {BrowseCoursesComponent} from "./browse-courses/browse-courses.component";
import {CompleteProfileComponent} from "./complete-profile/complete-profile.component";
import {AllJobsComponent} from "./all-jobs/all-jobs.component";
import {ViewJobComponent} from "./shared/view-job/view-job.component";
import {CvBuilderComponent} from "./cv-builder/cv-builder.component";
import {AllCompaniesComponent} from "./all-companies/all-companies.component";
import {CompanyProfileComponent} from "./company-profile/company-profile.component";
import {ReviewComponent} from "./review/review.component";
import {ProfileComponent} from "./profile/profile.component";
import {AddCourseComponent} from "./add-course/add-course.component";
import {AlumniProfileComponent} from "./alumni-profile/alumni-profile.component";
import {AuthGuard} from "./_guards/auth.guard";

const routes: Routes = [
  {
    path:'',
    component: RegisterComponent,
    pathMatch: 'full'
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'search/:location/:keywords',
    component: JobSearchComponent
  },
  {
    path: 'search/:keywords',
    component: JobSearchComponent
  },
  {
    path: 'courses',
    component: BrowseCoursesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'complete-profile',
    component: CompleteProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'jobs',
    component: AllJobsComponent
  },
  {
    path: 'job/:positionId',
    component: ViewJobComponent
  },
  {
    path: 'apply/:positionId',
    component: CvBuilderComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'companies',
    component: AllCompaniesComponent
  },
  {
    path: 'company/:name',
    component: CompanyProfileComponent
  },
  {
    path: 'review/:name',
    component: ReviewComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'settings',
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'add-course',
    component: AddCourseComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'profile/:userId',
    component: AlumniProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
