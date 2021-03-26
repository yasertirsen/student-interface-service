import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './register/register.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatCardModule } from "@angular/material/card";
import { NgxWebstorageModule } from "ngx-webstorage";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { LoginComponent } from './login/login.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { MainNavComponent } from './main-nav/main-nav.component';
import { HomeComponent } from './home/home.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SearchToolbarComponent } from './shared/search-toolbar/search-toolbar.component';
import { MatTableModule } from "@angular/material/table";
import { JobSearchComponent } from './job-search/job-search.component';
import { JobTileComponent } from './shared/job-tile/job-tile.component';
import { BrowseCoursesComponent } from './browse-courses/browse-courses.component';
import { CourseTileComponent } from './browse-courses/course-tile/course-tile.component';
import { AddLinkedinDialogComponent } from './home/add-linkedin-dialog/add-linkedin-dialog.component';
import { MatDialogModule } from "@angular/material/dialog";
import { CourseDialogComponent } from './browse-courses/course-dialog/course-dialog.component';
import { MatStepperModule } from "@angular/material/stepper";
import { CompleteProfileComponent } from './complete-profile/complete-profile.component';
import { AllJobsComponent } from './all-jobs/all-jobs.component';
import { ViewJobComponent } from './shared/view-job/view-job.component';
import { CvBuilderComponent } from './cv-builder/cv-builder.component';
import { MatChipsModule } from "@angular/material/chips";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSpinnerOverlayComponent } from './shared/mat-spinner-overlay/mat-spinner-overlay.component';
import { CompanyProfileComponent } from './company-profile/company-profile.component';
import { AllCompaniesComponent } from './all-companies/all-companies.component';
import { ReviewComponent } from './review/review.component';
import {MatSelectModule} from "@angular/material/select";
import { ProfileComponent } from './profile/profile.component';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { EditSummaryComponent } from './profile/edit-summary/edit-summary.component';
import { AddProjectDialogComponent } from './profile/add-project-dialog/add-project-dialog.component';
import { AddExperienceDialogComponent } from './profile/add-experience-dialog/add-experience-dialog.component';
import { AddSkillsDialogComponent } from './profile/add-skills-dialog/add-skills-dialog.component';
import { ApplyDialogComponent } from './cv-builder/apply-dialog/apply-dialog.component';
import { MatRadioModule } from '@angular/material/radio';
import { AddCourseComponent } from './add-course/add-course.component';
import { AddModuleDialogComponent } from './add-course/add-module-dialog/add-module-dialog.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AlumniProfileComponent } from './alumni-profile/alumni-profile.component';
import { AuthGuard } from './_guards/auth.guard';
import {TokenInterceptor} from "./shared/interceptor/TokenInterceptor";
import { GetUpdatesDialogComponent } from './company-profile/get-updates-dialog/get-updates-dialog.component';
import {MatPaginatorModule} from "@angular/material/paginator";
import { ChangePasswordComponent } from './login/change-password/change-password.component';
import { VerifyChangePasswordComponent } from './login/verify-change-password/verify-change-password.component';


@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    NotFoundComponent,
    MainNavComponent,
    HomeComponent,
    SearchToolbarComponent,
    JobSearchComponent,
    JobTileComponent,
    BrowseCoursesComponent,
    CourseTileComponent,
    AddLinkedinDialogComponent,
    CourseDialogComponent,
    CompleteProfileComponent,
    AllJobsComponent,
    ViewJobComponent,
    CvBuilderComponent,
    MatSpinnerOverlayComponent,
    CompanyProfileComponent,
    AllCompaniesComponent,
    ReviewComponent,
    ProfileComponent,
    EditSummaryComponent,
    AddProjectDialogComponent,
    AddExperienceDialogComponent,
    AddSkillsDialogComponent,
    ApplyDialogComponent,
    AddCourseComponent,
    AddModuleDialogComponent,
    AlumniProfileComponent,
    GetUpdatesDialogComponent,
    ChangePasswordComponent,
    VerifyChangePasswordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    FontAwesomeModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatButtonModule,
    LayoutModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    NgxWebstorageModule.forRoot(),
    BrowserAnimationsModule,
    NgbModule,
    MatTableModule,
    MatDialogModule,
    MatStepperModule,
    ReactiveFormsModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatSnackBarModule,
    MatMenuModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatGridListModule,
    MatDatepickerModule,
    MatRadioModule,
    FlexLayoutModule,
    MatPaginatorModule
  ],
  providers: [
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
