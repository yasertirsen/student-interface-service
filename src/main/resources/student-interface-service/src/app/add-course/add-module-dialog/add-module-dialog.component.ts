import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {ModuleModel} from "../../models/module.model";
import {SkillModel} from "../../models/skill.model";

@Component({
  selector: 'app-add-module-dialog',
  templateUrl: './add-module-dialog.component.html',
  styleUrls: ['./add-module-dialog.component.css']
})
export class AddModuleDialogComponent implements OnInit {
  module: ModuleModel = {
    moduleId: null,
    name: null,
    skill: {
      skillId: null,
      skillName: null
    }
  }

  constructor(public addModule: MatDialogRef<AddModuleDialogComponent>) { }


  onNoClick(): void {
    this.addModule.close()
  }

  onAdd(): void {
    this.addModule.close(this.module);
  }

  ngOnInit(): void {
  }

}
