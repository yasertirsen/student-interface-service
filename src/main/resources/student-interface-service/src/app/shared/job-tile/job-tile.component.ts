import {ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {PositionModel} from "../../model/position.model";
import {Router} from "@angular/router";
import {PositionService} from "../../service/position.service";
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {Observable} from "rxjs";

@Component({
  selector: 'app-job-tile',
  templateUrl: './job-tile.component.html',
  styleUrls: ['./job-tile.component.css']
})
export class JobTileComponent implements OnInit, OnDestroy {

  @Input() positions: PositionModel[];
  datasource: MatTableDataSource<PositionModel>;
  obs: Observable<any>;
  positionId: number;

  private paginator: MatPaginator;

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }

  setDataSourceAttributes() {
    this.datasource.paginator = this.paginator;
  }

  constructor(private router: Router, private positionService: PositionService,
              private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.datasource = new MatTableDataSource<PositionModel>(this.positions);
    for(let i = 0; i < this.datasource.data.length; i++) {
      if(this.datasource.data[i].archive)
        this.datasource.data.splice(i, 1);
    }
    this.changeDetectorRef.detectChanges();
    this.obs = this.datasource.connect();
  }

  goToLink(position: PositionModel) {
    if(!!position.positionId) {
      position.clicks++;
      this.positionService.updateJob(position).subscribe();
    }
    if(!!position.url) {
      window.open(position.url, "_blank")
    }
    else {
      this.positionId = position.positionId
      this.router.navigateByUrl('/job/' + this.positionId);
    }
  }

  ngOnDestroy() {
    if (this.datasource) {
      this.datasource.disconnect();
    }
  }

}
