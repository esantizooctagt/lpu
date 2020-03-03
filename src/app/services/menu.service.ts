import { Injectable } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  public details: ReplaySubject<any> = new ReplaySubject<any>(1);
  constructor(
    public menu: MenuController
  ) { }

  public toggle() {
    this.menu.toggle('mainMenu');
  }

}
