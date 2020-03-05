import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {  
  public appPages = [
    {
      title: 'Inicio',
      url: '/home',
      icon: '/assets/img/home-outline.svg'
    },
    {
      title: 'Mi Perfil',
      url: '/profile',
      icon: '/assets/img/person-outline.svg'
    },
    {
      title: 'Preferencias',
      url: '/preferences',
      icon: '/assets/img/grid-outline.svg'
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
