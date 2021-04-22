import {Component, OnInit} from '@angular/core';
import {PositionService} from "../service/position.service";
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-search-salaries',
  templateUrl: './search-salaries.component.html',
  styleUrls: ['./search-salaries.component.css']
})
export class SearchSalariesComponent implements OnInit {
  keywords: string;
  location = 'Dublin';
  averageSalary: number | undefined;
  noOfJobs: number | undefined;
  date = new Date();
  public searchForm: FormGroup = new FormGroup({
    keywords: new FormControl(null),
    location: new FormControl(null)
  });

  constructor(private positionService: PositionService) { }

  ngOnInit(): void {
  }

  onSearch() {
    this.keywords = this.searchForm.controls['keywords'].value.charAt(0).toUpperCase() + this.searchForm.controls['keywords'].value.slice(1);
    this.location = this.searchForm.controls['location'].value.charAt(0).toUpperCase() + this.searchForm.controls['location'].value.slice(1);
    this.positionService.searchSalaries(this.keywords, this.location).subscribe(data => {
      this.averageSalary = data.averageSalary;
      this.noOfJobs = data.noOfJobs;
    });
  }
}
