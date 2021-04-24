import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {FormControl} from "@angular/forms";
import {Observable} from "rxjs";
import {MatAutocomplete, MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {map} from "rxjs/operators";
import {MatChipInputEvent} from "@angular/material/chips";
import {SkillModel} from "../../model/skill.model";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-add-skills-dialog',
  templateUrl: './add-skills-dialog.component.html',
  styleUrls: ['./add-skills-dialog.component.css']
})
export class AddSkillsDialogComponent implements OnInit {
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  skillsCtrl = new FormControl();
  filteredSkills: Observable<SkillModel[]>;
  skills: SkillModel[] = [];
  allSkills: SkillModel[] = [];

  @ViewChild('skillInput') skillInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(public addSkillsDialog: MatDialogRef<AddSkillsDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public userSkills: SkillModel[]) {
    this.filteredSkills = this.skillsCtrl.valueChanges.pipe(
      map((skill: string | null) => skill ? this._filter(skill) : this.allSkills.slice()));
    for(let skill of userSkills) {
      this.skills.push(skill);
    }
  }

  onNoClick(): void {
    this.addSkillsDialog.close();
  }

  onSave():void {
    this.addSkillsDialog.close(this.skills);
  }

  addSkill(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.skills.push({skillId: null, skillName: value.trim()});
    }

    if (input) {
      input.value = '';
    }

    this.skillsCtrl.setValue(null);
  }

  removeSkill(skill: SkillModel): void {
    const index = this.skills.indexOf(skill);

    if (index >= 0) {
      this.skills.splice(index, 1);
    }
  }

  selectedSkill(event: MatAutocompleteSelectedEvent): void {
    this.skills.push({skillId: null, skillName: event.option.viewValue});
    this.skillInput.nativeElement.value = '';
    this.skillsCtrl.setValue(null);
  }

  private _filter(value: string): SkillModel[] {
    const filterValue = value.toLowerCase();

    return this.allSkills.filter(skill => skill.skillName.toLowerCase().indexOf(filterValue) === 0);
  }

  ngOnInit(): void {
  }
}
