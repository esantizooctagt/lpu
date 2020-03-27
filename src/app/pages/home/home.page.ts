import { Component, NgZone } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuService } from '@services/menu.service';
import { PopoverController } from '@ionic/angular';
import { LocationComponent } from '../../components/location/location.component';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { catchError, map } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { NotasService } from '@app/services/notas.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
  latitude: any = 0; //latitude
  longitude: any = 0; //longitude
  address: string;
  paises$: Observable<any>;
  
  searchDisp: boolean = false;
  valueSearch: string = '';
  items: [] = [];
  regiones: any=[];
  defaultValue: string = '';
  location: string = '';
  section: string = '';
  selpais: string = '';
  showSearch: boolean = false;
  constructor(
    private storage: Storage,
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    private notasService: NotasService,
    public popoverController: PopoverController
  ) {}

  // geolocation options
  options = {
    timeout: 10000, 
    enableHighAccuracy: true, 
    maximumAge: 3600
  };

  // geocoder options
  nativeGeocoderOptions: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5
  };

  // use geolocation to get user's device coordinates
  getCurrentCoordinates() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;
      this.getAddress(this.latitude, this.longitude);
     }).catch((error) => {
       console.log('Error getting location', error);
     });
  }

  // get address using coordinates
  getAddress(lat,long){
    this.nativeGeocoder.reverseGeocode(lat, long, this.nativeGeocoderOptions)
    .then((res: NativeGeocoderResult[]) => {
      this.address = this.pretifyAddress(res[0]);
    })
    .catch((error: any) => {
      alert('Error getting location'+ JSON.stringify(error));
    });
  }

  // address
  pretifyAddress(address){
    let obj = [];
    let data = "";
    for (let key in address) {
      obj.push(address[key]);
    }
    obj.reverse();
    for (let val in obj) {
      if(obj[val].length)
      data += obj[val]+', ';
    }
    return address.slice(0, -2);
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: LocationComponent,
      componentProps:{regiones: this.regiones},
      event: ev,
      translucent: true,
    });
    
    popover.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        if (dataReturned.data != ""){
          this.selpais = dataReturned.data;
        }
      }
    });

    return await popover.present();
  }

  ngOnInit(){
    this.location = "mundial";
    // this.getCurrentCoordinates();
    this.storage.get('preferences').then((val) => {
      if (val != null) {
        this.items = val;
      }
    });

    this.storage.get('user').then((val) => {
      if (val != undefined) {
        if (val.Paquete.toLowerCase().substr(0,3) == 'pre'){
          this.showSearch = true;
        }
      }
    });

    this.paises$ = this.notasService.getPaises().pipe(
      map(data => {
        let result = JSON.stringify(data).replace(',"error":false','');
        let values = JSON.parse(result);
        let region = '';
        let paises = [];
        for (const key of Object.keys(values)) {
          if (region == '') { region = values[key].region; }
          if (region != values[key].region){
            this.regiones.push({ region: region, paises: paises});
            paises = [];
            region = values[key].region;
          }
          const resultado  =  {
            PaisId: values[key].col_id,
            Descripcion: values[key].col_descripcion,
            Region: values[key].region,
          }
          paises.push(resultado);
        }
        this.regiones.push({ region: region, paises: paises});
        return this.regiones;
      }),
      catchError(err => {
        return throwError(err | err.message);
      })
    );
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

  getData(event: any){
    if (event.target.value === '0') {
      this.section = '';
    } else {
      this.section = event.target.value;
    }
  }
}
