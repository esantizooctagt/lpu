import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  public appPages = [
    {
      title: 'INICIO',
      url: '/home',
      color: 'black'
    },
    {
      title: 'PAIS',
      url: '/login',
      color: '#00A6D5'
    },
    {
      title: 'ECONOMIA',
      url: '/home',
      color: '#E51C24'
    },
    {
      title: 'POLITICA',
      url: '/home',
      color: '#ABABAB'
    },
    {
      title: 'DEPORTES',
      url: '/home',
      color: '#84BE3F'
    },
    {
      title: 'SUCESOS',
      url: '/home',
      color: '#EF8B1E'
    },
    {
      title: 'OTROS',
      url: ' /home',
      color: '#E5DF23'
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
