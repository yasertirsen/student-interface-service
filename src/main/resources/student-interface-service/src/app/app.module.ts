import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './register/register.component';
import {FormsModule} from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatCardModule} from "@angular/material/card";
import {NgxWebstorageModule} from "ngx-webstorage";
import {ToastrModule} from "ngx-toastr";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import { LoginComponent } from './login/login.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { MainNavComponent } from './main-nav/main-nav.component';
import { HomeComponent } from './home/home.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SearchToolbarComponent } from './shared/search-toolbar/search-toolbar.component';
import {MatTableModule} from "@angular/material/table";
import { JobSearchComponent } from './job-search/job-search.component';
import { JobTileComponent } from './shared/job-tile/job-tile.component';
import { BrowseCoursesComponent } from './browse-courses/browse-courses.component';
import { CourseTileComponent } from './browse-courses/course-tile/course-tile.component';
import { AddLinkedinDialogComponent } from './home/add-linkedin-dialog/add-linkedin-dialog.component';
import {MatDialogModule} from "@angular/material/dialog";
import { CourseDialogComponent } from './browse-courses/course-dialog/course-dialog.component';

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
    CourseDialogComponent
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
    ToastrModule.forRoot(),
    NgbModule,
    MatTableModule,
    MatDialogModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
