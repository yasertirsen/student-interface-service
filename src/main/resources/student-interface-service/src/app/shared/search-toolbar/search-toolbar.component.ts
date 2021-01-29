import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";

@Component({
  selector: 'app-search-toolbar',
  templateUrl: './search-toolbar.component.html',
  styleUrls: ['./search-toolbar.component.css']
})
export class SearchToolbarComponent implements OnInit {

  keywords: string;
  location: string;
  activeRoute: string;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
  }

  onSearch() {
    this.router.events.subscribe((event) => {
      if(event instanceof NavigationEnd && event.url) {
        this.activeRoute = event.url;
      }
    });
    // if(this.activeRoute !== '/search') {
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
      this.router.navigateByUrl('/search/' + this.location + '/' + this.keywords));
    // }
    // else {
    //   this.activatedRoute.params.subscribe(params => {
    //     this.location = params['location'];
    //     this.keywords = params['keywords'];
    //   });
      // window.location.reload();
    // }
  }
}
