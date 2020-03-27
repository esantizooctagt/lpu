import { Component, OnInit, Input, SimpleChange } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { NotasService } from '@services/notas.service';
import { Storage } from '@ionic/storage';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { map, filter, catchError } from 'rxjs/operators';
import { Observable, throwError, Subscription } from 'rxjs';

@Component({
  selector: 'app-notas',
  templateUrl: './notas.component.html',
  styleUrls: ['./notas.component.scss'],
})
export class NotasComponent implements OnInit {
  @Input() search: string;
  @Input() loc: string;
  @Input() sec: string;
  @Input() pais: string;

  notas$ : Observable<any>;
  bookmark: Subscription;
  bookmarkDel: Subscription;
  loading: any;
  error: string = '';
  token: string = '';
  UserId: string = '';
  Nombre: string = '';
  Correo: string = '';
  Foto: string = '';
  Paquete: string = '';
  Gustos: string = '';
  Follows: any;
  pref: any[]=[];
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
    private notasService: NotasService,
    public loadingController: LoadingController,
    private iab: InAppBrowser,
    private socialSharing: SocialSharing,
    public toastController: ToastController
    ) { }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: "primary"
    });

    toast.present();
  }

  ngOnInit() {
    this.storage.get('preferences').then((val) => {
      if (val != null) {
        val.forEach(element => {
          this.pref.push(element.Nombre);
        });
      }
    }, error => {
      this.pref = [];
    });

    this.storage.get('user').then((val) => {
      if (val !=null){
        this.token = val.Token;
        this.UserId = val.UserId;
        this.Nombre = val.Nombre;
        this.Correo = val.Email;
        this.Foto = val.Foto;
        this.Gustos = val.Gustos;
        this.Paquete = val.Paquete;
        this.Follows = val.Follows;
      }
    });
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      message: 'Cargando Notas...',
      duration: 3000
    });
    await this.loading.present();
  }

  getColor(category: string){
    let color = "";
    switch (category) {
      case "1":
          color = "#84BE3F";
          break;
      case "2":
          color = "#ABABAB";
          break;
      case "3":
          color = "#E51C24";
          break;
      case "4":
          color = "#EF8B1E";
          break;
      case "5":
          color = "#00A6D5";
          break;
      case "6":
          color = "#00A6D5";
          break;
      default:
          color = "#E5DF23";
          break;
    }
    return color;
  }

  OpenUrl(link: string){
    this.iab.create(link, '_blank', this.options);
  }

  SharedLink(nota: any){
    // let nota = this.notas$.pipe(filter(x => x.NotaId === id));
    var options = {
      message: 'Te han compartido la siguiente nota : ' + nota.Titulo, // not supported on some apps (Facebook, Instagram)
      subject: nota.Titulo, // fi. for email
      //files: ['', ''], // an array of filenames either locally or remotely
      url: nota.UrlLink,
      //chooserTitle: 'Pick an app', // Android only, you can override the default share sheet title
      //appPackageName: 'com.apple.social.facebook', // Android only, you can provide id of the App you want to share with
      iPadCoordinates: '0,0,0,0' //IOS only iPadCoordinates for where the popover should be point.  Format with x,y,width,height
    };
    this.socialSharing.shareWithOptions(options).then((res) => {
      console.log('shared link');
      console.log(res);
    }).catch((e) =>{
      console.log(e.message);
    })
  }

  SaveBookmark(nota: any){
    if (this.token != ''){
      const formData = {
        id : nota.NotaId,
        token : this.token
      }
      this.bookmark = this.notasService.postBookmark(formData).subscribe(res => {
          if (res != undefined){
            const data = {
              Token: this.token,
              UserId: this.UserId,
              Nombre: this.Nombre,
              Email: this.Correo,
              Foto: this.Foto,
              Gustos: this.Gustos,
              Paquete: this.Paquete,
              Follows: JSON.parse(JSON.stringify(res).replace(',"error":false',''))
            }
            nota.Sel =1;
            this.storage.set('user', data);
            this.presentToast("Nota almacenada en coleccion");
          }          
      });
    } else {
      this.presentToast("Debe iniciar sesion para guardar en coleccion");
    }
  }

  DelBookmark(nota: any){
    if (this.token != ''){
      const formData = {
        id : nota.NotaId,
        token : this.token
      }
      this.bookmarkDel = this.notasService.delBookmark(formData).subscribe(res => {
          if (res != undefined){
            const data = {
              Token: this.token,
              UserId: this.UserId,
              Nombre: this.Nombre,
              Email: this.Correo,
              Foto: this.Foto,
              Gustos: this.Gustos,
              Paquete: this.Paquete,
              Follows: JSON.parse(JSON.stringify(res).replace(',"error":false',''))
            }
            nota.Sel =0;
            this.storage.set('user', data);
            this.presentToast("Nota eliminada de coleccion");
          }          
      });
    } else {
      this.presentToast("Debe iniciar sesion para guardar en coleccion");
    }
  }

  ngOnDestroy() {
    if (this.bookmark != undefined){
      this.bookmark.unsubscribe();
    }
    if (this.bookmarkDel != undefined){
      this.bookmarkDel.unsubscribe();
    }
  }

  trackById(index: number, item: any) {
    return item.NotaId;
  }

  async ngOnChanges(changes: {[propertyName: string]: SimpleChange}){
    this.error = '';
    if (changes['search'] != undefined){
      await this.presentLoading();
      this.notas$ = this.notasService.getNotas(this.search).pipe(
        map(data => {
          let result = JSON.stringify(data).replace(',"error":false','');
          let values = JSON.parse(result);
          let valores =[];
          for (const key of Object.keys(values)) {
            let url = values[key].col_url_fuente.split('/')[0] + '//' + values[key].col_url_fuente.split('/')[1] + '/' + values[key].col_url_fuente.split('/')[2];
            var pubDate = new Date(values[key].col_fecha_publicacion);
            var curDate = new Date();
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

            const resultado  =  {
              NotaId: values[key].col_id,
              Pais: values[key].col_pais,
              Titulo: values[key].col_titulo,
              Resumen: (values[key].col_contenido.length > 180 ? values[key].col_contenido.substring(0,180).trim() : values[key].col_contenido.trim()),
              UrlFuente: values[key].col_url_fuente.split('/')[2],
              UrlLink: values[key].col_url_fuente,
              UrlImage: (values[key].col_url_img == '' ? '' : (values[key].col_url_img.indexOf('http') === 0 ? values[key].col_url_img : url+ values[key].col_url_img)),
              CatColor: this.getColor(values[key].col_cat_id),
              Categoria: values[key].col_categoria,
              Ranking: values[key].col_ranking,
              Fecha: dispDate, //values[key].col_fecha_publicacion.split(' ')[0]
              Sel: this.searchNota(values[key].col_id)
            }
            valores.push(resultado);
          }
          this.loading.dismiss();
          if (valores.length === 0){
            this.error = "No se encontraron resultados en su busqueda";
          }
          return valores;
        }),
        catchError(err => {
          this.loading.dismiss();
          this.error = 'Error en la carga de datos intente de nuevo';
          return throwError(err | err.message);
        })
      );
    }

    if (changes['sec'] != undefined || changes['loc'] != undefined || changes['pais'] != undefined){
      await this.presentLoading();
      this.notas$ = this.notasService.getNotasFiltros((this.loc == null ? '' : (this.pais != '' ? 'pais' : this.loc)), (this.sec == null ? '': this.sec), (this.pais == null ? '' : this.pais)).pipe(
        map(data => {
          let result = JSON.stringify(data).replace(',"error":false','');
          let result2 = result.replace('"error":false','');
          let values = JSON.parse(result2);
          let valores =[];
          for (const key of Object.keys(values)) {
            let url = values[key].col_url_fuente.split('/')[0] + '//'+ values[key].col_url_fuente.split('/')[1] +values[key].col_url_fuente.split('/')[2];
            var pubDate = new Date(values[key].col_fecha_publicacion);
            var curDate = new Date();
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
              dispDate = hours + (hours === 1 ? ' hr' : ' hrs');
            } else if (minutes > 0){
              dispDate = minutes + (minutes === 1 ? ' min' : ' mins');
            }
            const resultado  =  {
              NotaId: values[key].col_id,
              Pais: values[key].col_pais,
              Titulo: values[key].col_titulo,
              Resumen: values[key].col_contenido.trim(), //(values[key].col_contenido.length > 180 ? values[key].col_contenido.substring(0,180) : values[key].col_contenido),
              UrlFuente: values[key].col_url_fuente.split('/')[2],
              UrlLink: values[key].col_url_fuente,
              UrlImage: (values[key].col_url_img == '' ? '' : (values[key].col_url_img.indexOf('http') === 0 ? values[key].col_url_img : url+ values[key].col_url_img)),
              CatColor: this.getColor(values[key].col_cat_id),
              Categoria: values[key].col_categoria,
              Ranking: values[key].col_ranking,
              Fecha: dispDate, //values[key].col_fecha_publicacion.split(' ')[0]
              Sel: this.searchNota(values[key].col_id)
            }
            valores.push(resultado);
          }
          this.loading.dismiss();
          if (valores.length === 0){
            this.error = "No se encontraron resultados en su busqueda";
          }
          return valores;
        }),
        catchError(err => {
          this.loading.dismiss();
          this.error = 'Error en la carga de datos intente de nuevo';
          return throwError(err | err.message);
        })
      );
    }
  }

  searchNota(id: number): number{
    if (this.Follows != undefined){
      for (const key of Object.keys(this.Follows)) {  
        if (this.Follows[key].ID === id){
          return 1;
        }
      }
    }
    return 0;
  }

}
