import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { ToastController, NavController } from '@ionic/angular';
import { UserService } from '@app/services/user.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { InAppBrowserOptions, InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  paquete$: Observable<any>;
  user: any;
  follows: any;
  nota: any[] = [];
  nombre: string = '';
  email: string = '';
  foto: string = '';
  Titulo: string = '';
  Precio: string = '';
  Descripcion: string = '';
  paquete: string = '';
  Display: string = 'plan';
  notifications: boolean = true;
  options : InAppBrowserOptions = {
    location : 'yes',//Or 'no' 
    hidden : 'no', //Or  'yes'
    clearcache : 'yes',
    clearsessioncache : 'yes',
    zoom : 'yes',//Android only ,shows browser zoom controls 
    hardwareback : 'yes',
    mediaPlaybackRequiresUserAction : 'no',
    shouldPauseOnSuspend : 'no', //Android only 
    closebuttoncaption : 'Close', //iOS only
    disallowoverscroll : 'no', //iOS only 
    toolbar : 'yes', //iOS only 
    enableViewportScale : 'no', //iOS only 
    allowInlineMediaPlayback : 'no',//iOS only 
    presentationstyle : 'pagesheet',//iOS only 
    fullscreen : 'yes',//Windows only    
};

  constructor(
    private storage: Storage,
    private router: Router,
    private userService: UserService,
    public toastController: ToastController,
    private iab: InAppBrowser,
    public nav: NavController
  ) { }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Usuario desconectado satisfactoriamente.',
      duration: 2000,
      color: "primary"
    });

    toast.onDidDismiss().then(_ => {
      this.nav.setDirection('root');
      this.router.navigate(['/login']);
    })
    toast.present();
  }

  ngOnInit() {
    this.storage.get('notif').then((val) => {
      if (val != undefined){
        this.notifications = val;
      }
    }).catch(error => {
        this.notifications = true;
      }
    );

    this.storage.get('user').then((val) => {
      if (val != null) {
        this.nombre = val.Nombre;
        this.email = val.Email;
        this.foto = val.Foto;
        this.paquete = val.Paquete;
        this.follows = val.Follows;
        var curDate = new Date();
        for (const key of Object.keys(this.follows)) {      
            var pubDate = new Date(this.follows[key].fecha);
            var difDate:number = (+pubDate-+curDate);

            var diffInSeconds = Math.abs(difDate) / 1000;
            var anios = Math.floor(diffInSeconds / 31536000);
            var months = Math.floor(diffInSeconds / 2592000);
            var weeks = Math.floor(diffInSeconds / 604800); 
            var days = Math.floor(diffInSeconds / 86400);
            var hours = Math.floor(diffInSeconds / 60 / 60 % 24);
            var minutes = Math.floor(diffInSeconds / 60 % 60);

            var dispDate = '';
            if (anios > 0){
              dispDate = anios+ (anios === 1 ? ' año': ' años');
            } else if (months > 0){
              dispDate = months+ (months === 1 ? ' mes' : ' meses');
            } else if (weeks > 0) {
              dispDate = weeks + ' sem';
            } else if (days > 0) {
              dispDate = days + (days === 1 ? ' dia' : ' dias');
            } else if (hours > 0) {
              dispDate = hours + (hours === 1 ? ' hora' : ' horas');
            } else if (minutes > 0){
              dispDate = minutes + (minutes === 1 ? ' minuto' : ' minutos');
            }

          this.nota.push({ "NotaId": this.follows[key].ID, "Titulo": this.follows[key].titulo, "UrlImage": this.follows[key].imagen, "UrlLink": this.follows[key].link, "UrlFuente": this.follows[key].link.split('/')[2], "Fecha": dispDate});
        }
        this.paquete$ =this.userService.getPaquete("45").pipe(
          map(res => { 
            this.Titulo = res[0].post_name;
            this.Precio = res[1].precio;
            this.Descripcion = res[0].post_content;
            return res; }
          )
        );
      }
    });
  }

  OpenUrl(link: string){
    this.iab.create(link, '_blank', this.options);
  }

  async onSubmit(){
    this.storage.remove('user').then((val) => {
      if (val === undefined){
        console.log('usuario desconectado');
      }
    });
    await this.presentToast();
  }

  segmentChanged(event){
    this.Display = event.target.value;
  }

  setNotifications(){
    this.notifications = !this.notifications;
    this.storage.set('notif', this.notifications);
  }

}
