import { Component, OnInit } from '@angular/core';
import { MenuService } from '@services/menu.service';
import { CoreService } from '@app/core/core.service';

export interface MenuLink {
  title: string;
  linkHref: string;
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  public appPages = [
    {
      title: 'INICIO',
      url: '/home',
      section: '',
      color: 'black'
    },
    {
      title: 'PAIS',
      url: '/home',
      section: '6',
      color: '#00A6D5'
    },
    {
      title: 'ECONOMIA',
      url: '/home',
      section: '3',
      color: '#E51C24'
    },
    {
      title: 'POLITICA',
      url: '/home',
      section: '2',
      color: '#ABABAB'
    },
    {
      title: 'DEPORTES',
      url: '/home',
      section: '1',
      color: '#84BE3F'
    },
    {
      title: 'SUCESOS',
      url: '/home',
      section: '4',
      color: '#EF8B1E'
    },
    {
      title: 'OTROS',
      url: ' /home',
      section: '7',
      color: '#E5DF23'
    }
  ];

  constructor(
    public menu: MenuService
  ) { }

  ngOnInit() {}
  
  public navToPage(link: MenuLink) {
    console.log('Navigating to: ', link.linkHref);
    // this.core.navToPage(link.linkHref);
  }

}
