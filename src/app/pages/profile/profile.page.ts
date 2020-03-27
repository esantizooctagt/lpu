import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { ToastController, NavController } from '@ionic/angular';
import { UserService } from '@app/services/user.service';
import { Observable, throwError, Subscription } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { InAppBrowserOptions, InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  paquete$: Observable<any>;
  paquetes$: Observable<any>;
  subPaquete: Subscription;
  paquetes: any [];
  paqueteId: string ='';
  paqName: string='';

  data: any;
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
  error: string = '';
  valueToken: string ='';
  userCod: string ='';
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

  async presentToast(value: string, cod: number) {
    const toast = await this.toastController.create({
      message: value,
      duration: 2000,
      color: "primary"
    });

    toast.onDidDismiss().then(_ => {
      if (cod == 100){
        this.nav.setDirection('root');
        this.router.navigate(['/login']);
      } else {
        this.nav.setDirection('root');
        this.router.navigate(['/home']);
      }
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
      if (val != undefined) {
        this.nombre = val.Nombre;
        this.email = val.Email;
        this.foto = val.Foto;
        this.paquete = val.Paquete;
        this.follows = val.Follows;
        this.valueToken = val.Token;
        this.userCod = val.UserId;
        this.data = val;
        var curDate = new Date();
        this.paquete$ =this.userService.getPaquete(this.paquete).pipe(
          map(res => { 
            this.Titulo = res[0].post_name;
            this.Precio = res[1].precio;
            this.Descripcion = res[0].post_content;
            return res; }
          )
        );
        this.paquetes$ =this.userService.getPaquetes().pipe(
          map(data => {
            let result = JSON.stringify(data).replace(',"error":false', '');
            let result2 = result.replace('"error":false', '');
            let values = JSON.parse(result2);
            let paqs = values[0];
            this.paquetes = [];
            for (const key of Object.keys(paqs)) {
              if (this.paquete.toLowerCase().substr(0,3) != paqs[key].post_title.toLowerCase().substr(0,3)){
                this.paquetes.push({ PaqueteId : paqs[key].ID, Titulo : paqs[key].post_title, Descripcion : paqs[key].post_content, Precio : paqs[key].post_excerpt, Sel : false});
              }
            }
            return this.paquetes;
          }),
          catchError(err => {
            this.router.navigate(['/home']);
            return throwError(err | err.message);
          })
        );

        if (this.follows != undefined){
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
        }
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
    await this.presentToast('Usuario desconectado satisfactoriamente.', 100);
  }

  segmentChanged(event){
    this.Display = event.target.value;
  }

  setNotifications(){
    this.notifications = !this.notifications;
    this.storage.set('notif', this.notifications);
  }

  setPaquete(name: string, paqueteId: string){
    this.paqueteId = paqueteId;
    this.paqName = (name == 'basic' ? 'basico' : name);
    for (let i = 0; i < this.paquetes.length; i++) {
      if (this.paquetes[i].PaqueteId != this.paqueteId){
        this.paquetes[i].Sel= false;
      } else {
        this.paquetes[i].Sel = true;
      }
    }
  }

  onUpgradePlan(){
    const userData = {
      correo: this.email
    }

    const formData = {
      id: userData,
      token: this.valueToken,
      paquete: this.paqueteId
    }
    this.subPaquete = this.userService.postPaqueteUser(this.userCod, formData).subscribe(async res => {
      if (res.error === true){
        this.error = res.msg;
      } else {
        this.error = '';
        this.data.Paquete = this.paqName;
        this.storage.set('user', this.data);
        this.paqName = '';
        this.paqueteId = '';
        await this.presentToast('Plan actualizado con éxito', 200);
      }
    });
  }

  ngOnDestroy() {
    if (this.subPaquete != undefined){
      this.subPaquete.unsubscribe();
    }
  }

}
