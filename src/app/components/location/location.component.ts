import { Component, OnInit } from '@angular/core';
import { PopoverController, NavParams, Events } from '@ionic/angular';

// import { OpenNativeSettings } from '@ionic-native/open-native-settings/ngx';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss'],
})
export class LocationComponent implements OnInit {
  regiones = [];

  constructor(
    private events: Events,
    private navParams: NavParams,
    private popoverController: PopoverController,
  ) { }

  ngOnInit() {
    //Get data from popover page
    this.regiones = this.navParams.get('regiones');
  }

  // eventFromPopover() {
  //   // this.events.publish('fromPopoverEvent');
  //   this.popoverController.dismiss();
  // }

  selectLocation(paisId: number){
    this.popoverController.dismiss(paisId);
  }

  trackById(index: number, item: any) {
    return item.PaisId;
  }

}
