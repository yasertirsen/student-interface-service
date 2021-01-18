import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatAutocomplete, MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {map} from "rxjs/operators";
import {Observable} from "rxjs";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {MatChipInputEvent} from "@angular/material/chips";
import {LocalStorageService} from "ngx-webstorage";
import {UserService} from "../shared/user.service";
import {UserModel} from "../models/user.model";
import {ProjectModel} from "../models/project.model";
import {ProfileModel} from "../models/profile.model";
import {SkillModel} from "../models/skill.model";
import {Router} from "@angular/router";
import {ResumeService} from "../shared/resume.service";

@Component({
  selector: 'app-cv-builder',
  templateUrl: './cv-builder.component.html',
  styleUrls: ['./cv-builder.component.css']
})
export class CvBuilderComponent implements OnInit {
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
  filteredSkills: Observable<string[]>;
  filteredProjects: Observable<string[]>;
  skills: string[] = [];
  allSkills: string[] = [];
  projects: string[] = [];
  allProjects: string[] = [];
  user: UserModel;
  project: ProjectModel = {
    projectId: 0,
    title: null,
    description: null
  };
  skill: SkillModel;

  @ViewChild('skillInput') skillInput: ElementRef<HTMLInputElement>;
  @ViewChild('projectInput') projectInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(private _formBuilder: FormBuilder, private localStorage: LocalStorageService, private userService: UserService,
              private resumeService: ResumeService) {
    this.filteredSkills = this.skillsCtrl.valueChanges.pipe(
      map((skill: string | null) => skill ? this._filter(skill) : this.allSkills.slice()));
    this.filteredProjects = this.projectsCtrl.valueChanges.pipe(
      map((project: string | null) => project ? this._projectsFilter(project) : this.allProjects.slice()));
    this.userService.getCurrentUser().subscribe(user => {
      this.user = user;
      if(this.user.profile.projects === undefined) {
        this.user.profile.projects = [];
      }
      else {
        for(let project of this.user.profile.projects) {
          this.allProjects.push(project.title);
        }
        this.projects.push(this.allProjects[0]);
      }
      this.summary = this.user.profile.bio;
      this.userService.getSkillsNames(this.user.profile).subscribe(skills => {
        this.allSkills = skills
        this.skills.push(this.allSkills[0])
      })
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
    const index = this.skills.indexOf(project);

    if (index >= 0) {
      this.projects.splice(index, 1);
    }
  }

  selectedProject(event: MatAutocompleteSelectedEvent): void {
    this.projects.push(event.option.viewValue);
    this.projectInput.nativeElement.value = '';
    this.projectsCtrl.setValue(null);
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

  onDone() {
    if(this.project.title !== null || this.project.description !== null) {
      this.user.profile.projects.push(this.project);
    }
    else {
      for(let project of this.user.profile.projects) {
        if(!this.projects.includes(project.title)) {
          let index = this.user.profile.projects.indexOf(project);
          this.user.profile.projects.splice(index, 1);
        }
      }
    }
    this.user.profile.externalSkills = [];
    this.user.profile.bio = this.summary;
    for(let skill of this.skills) {
      this.skill = {skillId: 0, skillName: skill, industry: null}
      this.user.profile.externalSkills.push(this.skill);
    }
    this.resumeService.generateDynamicCv(this.user).subscribe(res => {
      const fileURL = URL.createObjectURL(res);
      window.open(fileURL, '_blank');
    });
  }
}
