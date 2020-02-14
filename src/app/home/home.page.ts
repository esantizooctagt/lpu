import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
  searchDisp: boolean = false;
  constructor() {}

  displaySearch(){
    this.searchDisp = !this.searchDisp;
  }
  hideSearch(){
    this.searchDisp = false;
  }
}
