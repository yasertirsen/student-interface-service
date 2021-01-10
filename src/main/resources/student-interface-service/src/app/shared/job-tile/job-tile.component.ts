import {Component, Input, OnInit} from '@angular/core';
import {PositionModel} from "../../models/position.model";
import {Router} from "@angular/router";

@Component({
  selector: 'app-job-tile',
  templateUrl: './job-tile.component.html',
  styleUrls: ['./job-tile.component.css']
})
export class JobTileComponent implements OnInit {

  @Input() positions: PositionModel[];
  positionId: number;

  constructor(private router: Router) {

  }

  ngOnInit(): void {
  }

  goToLink(position: PositionModel) {
    if(position.url !== null) {
      window.open(position.url, "_blank")
    }
    else {
      this.positionId = position.positionId
      this.router.navigateByUrl('/job/' + this.positionId);
    }

  }

}
