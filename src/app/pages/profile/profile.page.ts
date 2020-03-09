import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { ToastController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  user: any;
  nombre: string = '';
  email: string = '';
  foto: string = '';
  constructor(
    private storage: Storage,
    private router: Router,
    public toastController: ToastController,
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
    this.storage.get('user').then((val) => {
      if (val != null) {
        this.nombre = val.Nombre;
        this.email = val.Email;
        this.foto = val.Foto;
      }
    });
  }

  async onSubmit(){
    this.storage.remove('user').then((val) => {
      if (val === undefined){
        console.log('usuario desconectado');
      }
    });
    await this.presentToast();
  }
}
