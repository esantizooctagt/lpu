import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuService } from '@services/menu.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
  searchDisp: boolean = false;
  valueSearch: string = '';
  location: string = '';
  section: string = '';
  constructor(
    private route: ActivatedRoute,
    private menu: MenuService
  ) {}

  ngOnInit(){
    this.section = this.route.snapshot.paramMap.get('section');
    if (this.section === ''){
      this.location = "mundial";
    }
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

  selectLocation(event: any){
    this.location = event.target.value;
  }
}
