import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuService } from '@services/menu.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
  searchDisp: boolean = false;
  valueSearch: string = '';
  items: [] = [];
  defaultValue: string = '';
  location: string = '';
  section: string = '';
  constructor(
    private route: ActivatedRoute,
    private menu: MenuService,
    private router: Router,
    private storage: Storage
  ) {}

  ngOnInit(){
    // this.section = this.route.snapshot.paramMap.get('section');
    // if (this.section === ''){
    this.location = "mundial";
    // }
    this.storage.get('preferences').then((val) => {
      if (val != null) {
        this.items = val;
      }
    });
  }

  displaySearch(){
    this.searchDisp = !this.searchDisp;
  }

  hideSearch(){
    this.searchDisp = false;
  }

  filterNotas(event: any){
    this.valueSearch = event.target.value;
  }

  // selectLocation(event: any){
  //   // this.location = event.target.value;
  // }

  getData(event: any){
    if (event.target.value === 0) {
      this.section = '';
    } else {
      this.section = event.target.value;
    }
  }
}
