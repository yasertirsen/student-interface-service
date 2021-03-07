import {Component, Input, OnInit} from '@angular/core';
import {PositionModel} from "../../models/position.model";
import {Router} from "@angular/router";
import {PositionService} from "../position.service";

@Component({
  selector: 'app-job-tile',
  templateUrl: './job-tile.component.html',
  styleUrls: ['./job-tile.component.css']
})
export class JobTileComponent implements OnInit {

  @Input() positions: PositionModel[];
  positionId: number;

  constructor(private router: Router, private positionService: PositionService) {

  }

  ngOnInit(): void {
  }

  goToLink(position: PositionModel) {
    position.clicks++;
    this.positionService.updateJob(position).subscribe(data => {
      console.log(data);
    });
    if(position.url !== null) {
      window.open(position.url, "_blank")
    }
    else {
      this.positionId = position.positionId
      this.router.navigateByUrl('/job/' + this.positionId);
    }

  }

}
