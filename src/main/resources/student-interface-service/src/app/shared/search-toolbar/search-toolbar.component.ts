import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-search-toolbar',
  templateUrl: './search-toolbar.component.html',
  styleUrls: ['./search-toolbar.component.css']
})
export class SearchToolbarComponent implements OnInit {

  keywords: string;
  location: string;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onSearch() {
    this.router.navigateByUrl('/search/' + this.location + '/' + this.keywords);
  }
}
