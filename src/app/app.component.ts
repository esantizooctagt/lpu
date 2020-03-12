import { Component } from '@angular/core';
import { Platform, ModalController, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { Storage } from '@ionic/storage';

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
    private statusBar: StatusBar,
    private oneSignal: OneSignal,
    private alertCtrl: AlertController,
    private router: Router,
    private storage: Storage
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      
      this.splashScreen.show();
      
      setTimeout(() =>{
        this.splashScreen.hide();
      }, 4000);
      if (this.platform.is('cordova') || this.platform.is('ios') || this.platform.is('android')){
        this.setupPush('20a3f3a5-7c4d-490b-a443-bfcc70e25cdf', '1012338907944');
        this.storage.set('notif', true);
      }
    });
  }

  setupPush(appId, projNumber){
    this.oneSignal.startInit(appId,projNumber);
    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.None);
    this.oneSignal.handleNotificationReceived().subscribe(data => {
      let msg = data.payload.body;
      let title = data.payload.title;
      let addiotionalData = data.payload.additionalData;
      if (addiotionalData.task != '') {
        // this.showAlert(title, msg, addiotionalData.task);
        this.router.navigateByUrl('/home/'+ addiotionalData.task);
      }
    });
    this.oneSignal.handleNotificationOpened().subscribe(data => {
      let addiotionalData = data.notification.payload.additionalData;
      if (addiotionalData.task != '') {
        // this.showAlert('Notification opened', 'You already read this before', addiotionalData.task);
        this.router.navigateByUrl('/home/'+ addiotionalData.task);
      }
    });
    this.oneSignal.endInit();
  }

  async showAlert(title, msg, task){
    const alert = await this.alertCtrl.create({
      header: title,
      subHeader: msg,
      buttons: [
        {
          text: 'Mostrar', // `Action: ${task}`,
          handler: () => {
            this.router.navigateByUrl('/home/'+ task);
          }
        }
      ]
    })
    alert.present();
  }
}
