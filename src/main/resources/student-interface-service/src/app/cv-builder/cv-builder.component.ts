import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatAutocomplete, MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {map} from "rxjs/operators";
import {Observable} from "rxjs";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {MatChipInputEvent} from "@angular/material/chips";
import {LocalStorageService} from "ngx-webstorage";
import {UserService} from "../service/user.service";
import {UserModel} from "../model/user.model";
import {ProjectModel} from "../model/project.model";
import {SkillModel} from "../model/skill.model";
import {ResumeService} from "../service/resume.service";
import {PositionService} from "../service/position.service";
import {ApplicationModel} from "../model/application.model";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {ApplyDialogComponent} from "./apply-dialog/apply-dialog.component";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-cv-builder',
  templateUrl: './cv-builder.component.html',
  styleUrls: ['./cv-builder.component.css']
})
export class CvBuilderComponent implements OnInit {
  loading = true;
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  summary: string;
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  skillsCtrl = new FormControl();
  projectsCtrl = new FormControl();
  experienceCtrl = new FormControl();
  moduleCtrl = new FormControl();
  filteredSkills: Observable<string[]>;
  filteredProjects: Observable<string[]>;
  filteredExperiences: Observable<string[]>;
  filteredModules: Observable<string[]>;
  skills: string[] = [];
  allSkills: string[] = [];
  projects: string[] = [];
  allProjects: string[] = [];
  experiences: string[] = [];
  allExperiences: string[] = [];
  modules: string[] = [];
  allModules: string[] = [];
  user: UserModel;
  project: ProjectModel = {
    projectId: 0,
    title: null,
    description: null,
    date: null
  };
  skill: SkillModel;
  averageGrade: number;
  application: ApplicationModel;

  @ViewChild('skillInput') skillInput: ElementRef<HTMLInputElement>;
  @ViewChild('projectInput') projectInput: ElementRef<HTMLInputElement>;
  @ViewChild('experienceInput') experienceInput: ElementRef<HTMLInputElement>;
  @ViewChild('moduleInput') moduleInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(private _formBuilder: FormBuilder, private userService: UserService,
              private resumeService: ResumeService, private positionService: PositionService, private  _snackBar: MatSnackBar,
              private dialog: MatDialog, private router: Router, private activatedRoute: ActivatedRoute) {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    this.filteredSkills = this.skillsCtrl.valueChanges.pipe(
      map((skill: string | null) => skill ? this._filter(skill) : this.allSkills.slice()));
    this.filteredProjects = this.projectsCtrl.valueChanges.pipe(
      map((project: string | null) => project ? this._projectsFilter(project) : this.allProjects.slice()));
    this.filteredExperiences = this.experienceCtrl.valueChanges.pipe(
      map((experience: string | null) => experience ? this._experiencesFilter(experience) : this.allExperiences.slice()));
    this.filteredModules = this.moduleCtrl.valueChanges.pipe(
      map((module: string | null) => module ? this._moduleFilter(module) : this.allModules.slice()));
      if(this.user.profile.averageGrade === 0) {
        this.averageGrade = 0;
      }
      else {
        this.averageGrade = this.user.profile.averageGrade;
      }
      if(this.user.profile.projects === undefined) {
        this.user.profile.projects = [];
      }
      else {
        for(let project of this.user.profile.projects) {
          this.allProjects.push(project.title);
        }
        this.projects.push(this.allProjects[0]);
      }
      if(this.user.profile.experiences === undefined) {
        this.user.profile.experiences = [];
      }
      else {
        for(let experience of this.user.profile.experiences) {
          this.allExperiences.push(experience.role + ' - ' + experience.company);
        }
        this.experiences.push(this.allExperiences[0]);
      }
      if(this.user.profile.course !== null) {
        for(let module of this.user.profile.course.modules) {
          this.allModules.push(module.name);
        }
        this.modules.push(this.allModules[0]);
      }
      this.summary = this.user.profile.bio;
      this.userService.getSkillsNames(this.user.profile).subscribe(skills => {
        this.allSkills = skills
        this.skills.push(this.allSkills[0])
        this.loading = false;
      });
  }

  ngOnInit(): void {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });

    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.nullValidator]
    });
  }

  addProject(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.projects.push(value.trim());
    }

    if (input) {
      input.value = '';
    }

    this.projectsCtrl.setValue(null);
  }

  removeProject(project: string): void {
    const index = this.projects.indexOf(project);

    if (index >= 0) {
      this.projects.splice(index, 1);
    }
  }

  selectedProject(event: MatAutocompleteSelectedEvent): void {
    this.projects.push(event.option.viewValue);
    this.projectInput.nativeElement.value = '';
    this.projectsCtrl.setValue(null);
  }

  addExperience(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.experiences.push(value.trim());
    }

    if (input) {
      input.value = '';
    }

    this.experienceCtrl.setValue(null);
  }

  removeExperience(experience: string): void {
    const index = this.experiences.indexOf(experience);

    if (index >= 0) {
      this.experiences.splice(index, 1);
    }
  }

  selectedExperience(event: MatAutocompleteSelectedEvent): void {
    this.experiences.push(event.option.viewValue);
    this.experienceInput.nativeElement.value = '';
    this.experienceCtrl.setValue(null);
  }

  addModule(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.modules.push(value.trim());
    }

    if (input) {
      input.value = '';
    }

    this.moduleCtrl.setValue(null);
  }

  removeModule(module: string): void {
    const index = this.modules.indexOf(module);

    if (index >= 0) {
      this.modules.splice(index, 1);
    }
  }

  selectedModule(event: MatAutocompleteSelectedEvent): void {
    this.modules.push(event.option.viewValue);
    this.moduleInput.nativeElement.value = '';
    this.moduleCtrl.setValue(null);
  }

  addSkill(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.skills.push(value.trim());
    }

    if (input) {
      input.value = '';
    }

    this.skillsCtrl.setValue(null);
  }

  removeSkill(skill: string): void {
    const index = this.skills.indexOf(skill);

    if (index >= 0) {
      this.skills.splice(index, 1);
    }
  }

  selectedSkill(event: MatAutocompleteSelectedEvent): void {
    this.skills.push(event.option.viewValue);
    this.skillInput.nativeElement.value = '';
    this.skillsCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allSkills.filter(skill => skill.toLowerCase().indexOf(filterValue) === 0);
  }

  private _projectsFilter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allProjects.filter(project => project.toLowerCase().indexOf(filterValue) === 0);
  }

  private _experiencesFilter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allExperiences.filter(experience => experience.toLowerCase().indexOf(filterValue) === 0);
  }

  private _moduleFilter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allExperiences.filter(experience => experience.toLowerCase().indexOf(filterValue) === 0);
  }

  onEditDetails() {
    this.loading = true;
    if(this.project.title !== null || this.project.description !== null) {
      this.user.profile.projects.push(this.project);
    }
    else {
      for(let project of this.user.profile.projects) {
        if(!this.projects.includes(project.title)) {
          let index = this.user.profile.projects.indexOf(project);
          this.user.profile.projects.splice(index, this.user.profile.projects.length);
        }
      }
    }
    this.user.profile.externalSkills = [];
    this.user.profile.bio = this.summary;
    for(let skill of this.skills) {
      this.skill = {skillId: 0, skillName: skill}
      this.user.profile.externalSkills.push(this.skill);
    }
    for(let experience of this.user.profile.experiences) {
      if(!this.experiences.includes(experience.role + " - " + experience.company)) {
        let index = this.user.profile.experiences.indexOf(experience);
        this.user.profile.experiences.splice(index, 1);
      }
    }
    for(let module of this.user.profile.course.modules) {
      if(!this.modules.includes(module.name)) {
        let index = this.user.profile.course.modules.indexOf(module);
        this.user.profile.course.modules.splice(index, this.user.profile.course.modules.length);
      }
    }
    this.loading = false;
    const applyDialog =
      this.dialog.open(ApplyDialogComponent, {
        width: '500px',
        data: {user: this.user, positionId: this.activatedRoute.snapshot.params.positionId}
      });
    applyDialog.afterClosed().subscribe(result => {
      if(result !== null) {
        this.positionService.apply(result).subscribe(data => {
            console.log(data)
            this._snackBar.open('Applied successfully', 'Close', {
              duration: 5000,
            });
          },
          error => {
            console.log(error)
            this._snackBar.open('An error has occurred', 'Close', {
              duration: 5000,
            });
          });
      }
      this.router.navigateByUrl('/home');
    });
  }

  onSkip() {
    this.user.profile.course.modules = [];
  }
}
