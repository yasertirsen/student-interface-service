import {Component, Input, OnInit} from '@angular/core';
import {PositionModel} from "../../models/position.model";

@Component({
  selector: 'app-job-tile',
  templateUrl: './job-tile.component.html',
  styleUrls: ['./job-tile.component.css']
})
export class JobTileComponent implements OnInit {

  @Input() positions: PositionModel[];

  constructor() {

  }

  ngOnInit(): void {
  }

  goToLink(url: string) {
    window.open(url, "_blank")
  }

}
