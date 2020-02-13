import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { NotasService } from '@services/notas.service';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

@Component({
  selector: 'app-notas',
  templateUrl: './notas.component.html',
  styleUrls: ['./notas.component.scss'],
})
export class NotasComponent implements OnInit {

  notas;
  loading: any;

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
    private notasService: NotasService,
    public loadingController: LoadingController,
    private iab: InAppBrowser,
    private socialSharing: SocialSharing
    ) { }

  async ngOnInit() {
    await this.presentLoading();
    this.notasService.getNotas('').subscribe((data) => {
      let result = JSON.stringify(data).replace(',"error":false','');
      let values = JSON.parse(result);

      let valores =[];
      for (const key of Object.keys(values)) {
        const resultado  =  {
          NotaId: values[key].col_id,
          Pais: values[key].col_pais,
          Titulo: values[key].col_titulo,
          UrlFuente: values[key].col_url_fuente.split('/')[2],
          UrlLink: values[key].col_url_fuente,
          UrlImage: (values[key].col_url_img == '' ? '' : 'https://www.laprensa.hn'+ values[key].col_url_img),
          CatColor: this.getColor(values[key].col_cat_id),
          Categoria: values[key].col_categoria,
          Ranking: values[key].col_ranking,
          Fecha: values[key].col_fecha_publicacion.split(' ')[0]
        }
        valores.push(resultado);
      }
      this.notas = valores;
      this.loading.dismiss();
    })
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      message: 'Cargando Notas...'
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

  SharedLink(id: string){
    let nota = this.notas.filter(x => x.NotaId === id);
    var options = {
      message: 'Te han compartido la siguiente nota : ' + nota[0].Titulo, // not supported on some apps (Facebook, Instagram)
      subject: nota[0].Titulo, // fi. for email
      //files: ['', ''], // an array of filenames either locally or remotely
      url: nota[0].UrlLink,
      //chooserTitle: 'Pick an app', // Android only, you can override the default share sheet title
      //appPackageName: 'com.apple.social.facebook', // Android only, you can provide id of the App you want to share with
      iPadCoordinates: '0,0,0,0' //IOS only iPadCoordinates for where the popover should be point.  Format with x,y,width,height
    };
    this.socialSharing.shareWithOptions(options).then((res) => {
      console.log(res);
    }).catch((e) =>{
      console.log(e.message);
    })
  }
}
