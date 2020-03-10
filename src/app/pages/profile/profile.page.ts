import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { ToastController, NavController } from '@ionic/angular';
import { UserService } from '@app/services/user.service';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  paquete$: Observable<any>;
  user: any;
  nombre: string = '';
  email: string = '';
  foto: string = '';
  Titulo: string = '';
  Precio: string = '';
  Descripcion: string = '';
  paquete: string = '';

  constructor(
    private storage: Storage,
    private router: Router,
    private userService: UserService,
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
        this.paquete = val.Paquete;
        this.paquete$ =this.userService.getPaquete("45").pipe(
          map(res => { 
            console.log(res[0]);
            this.Titulo = res[0].post_name;
            this.Precio = res[1].precio;
            this.Descripcion = res[0].post_content;
            return res; }
          )
        );
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
