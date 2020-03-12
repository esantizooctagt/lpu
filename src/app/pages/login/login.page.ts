import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuService } from '@app/services/menu.service';
import { UserService } from '@app/services/user.service';
import { NavController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  error: string = '';
  subLogin: Subscription;

  constructor(
    private fb: FormBuilder,
    private menuService: MenuService,
    private userService: UserService,
    private storage: Storage,
    private router: Router,
    public navCtrl:NavController,
    public toastController: ToastController
  ) { }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Usuario logeado satisfactoriamente',
      duration: 2000,
      color: "primary"
    });

    toast.onDidDismiss().then(_ => {
      this.router.navigate(['/home']);
    })
    toast.present();
  }

  loginForm = this.fb.group({
    Email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
    Password: ['']
  })

  ngOnInit() {
  }

  onSubmit(){
    if (this.loginForm.invalid) { return;}
    this.error = '';
    const formData = {
      usuario: this.loginForm.controls.Email.value,
      contrasena: this.loginForm.controls.Password.value
    }
    this.subLogin = this.userService.userLogin(formData).subscribe(async res => {
      if (res.error === true){
        this.error = "Invalid credentials";
        this.menuService.userLogged = false;
      } else {
        this.error = '';
        const data = {
          Token: res.token,
          UserId: res.user.ID,
          Nombre: res.user.nombre,
          Email: res.user.correo,
          Foto: res.user.foto,
          Gustos: res.user.gustos,
          Paquete: res.user.paquete,
          Follows: res.user.follows
        }
        this.storage.set('user', data);
        this.menuService.userLogged = true;
        await this.presentToast();
      }
    });
  }

  ngOnDestroy() {
    if (this.subLogin != undefined){
      this.subLogin.unsubscribe();
    }
  }
}
