import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { UserService } from '@services/user.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, throwError, Observable } from 'rxjs';
import { ToastController, LoadingController } from '@ionic/angular';
import { map, catchError } from 'rxjs/operators';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  error: string = '';
  subLogin: Subscription;
  step: number = 1;
  paquetes$: Observable<any>;
  paquetes: any [];
  paqueteId: number =0;
  valueToken: string = '';
  userCod: number;
  fechaMin: string;
  fechaMax: string;
  loading: any;
  
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private storage: Storage,
    private router: Router,
    public loadingController: LoadingController,
    public toastController: ToastController
  ) { }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Usuario registrado satisfactoriamente.',
      duration: 2000,
      color: "primary"
    });

    toast.onDidDismiss().then(_ => {
      this.router.navigate(['/home']);
    })
    toast.present();
  }

  registerForm = this.fb.group({
    Name: ['', Validators.required],
    Email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
    Password: ['', Validators.required],
    Genero: [''],
    FechaNacimiento: ['', Validators.required]
  });
  
  ngOnInit() {
    var date = new Date();
    this.fechaMin = formatDate(date.setFullYear(date.getFullYear()- 90) && date,'yyyy-MM-dd','en-US');
    var date2 = new Date()
    this.fechaMax = formatDate(date2.setFullYear(date2.getFullYear()- 17) && date2,'yyyy-MM-dd','en-US');

    this.paquetes$ =this.userService.getPaquetes().pipe(
      map(data => {
        let result = JSON.stringify(data).replace(',"error":false', '');
        let result2 = result.replace('"error":false', '');
        let values = JSON.parse(result2);
        let paqs = values[0];
        this.paquetes = [];
        for (const key of Object.keys(paqs)) {
          this.paquetes.push({ PaqueteId : paqs[key].ID, Titulo : paqs[key].post_title, Descripcion : paqs[key].post_content, Precio : paqs[key].post_excerpt, Sel : false});
        }
        return this.paquetes;
      }),
      catchError(err => {
        this.router.navigate(['/home']);
        return throwError(err | err.message);
      })
    );
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      message: 'Registrando usuario...',
      duration: 3000
    });
    await this.loading.present();
  }

  async onSubmit(){
    if (this.paqueteId == 0) { return; }
    const userData = {
      nombre: this.registerForm.controls.Name.value,
      correo: this.registerForm.controls.Email.value,
      contrasena: this.registerForm.controls.Password.value
    }

    const formData = {
      usuario: userData,
      paquete: this.paqueteId
    }
    await this.presentLoading();
    this.subLogin = this.userService.postUser(formData).subscribe(async res => {
      if (res.error === true){
        this.loading.dismiss();
        this.error = res.msg;
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
        this.loading.dismiss();
        this.valueToken = res.token;
        this.userCod = res.user.ID;
        this.storage.set('user', data);
        await this.presentToast();
      }
    });
  }

  changeStep(){
    if (this.registerForm.invalid) { return; }
    this.step = 2;
  }

  setPaquete(paqId: any){
    if (paqId.detail.value != undefined && paqId.detail.value != 0){
      this.paqueteId = paqId.detail.value;
    }
  }

  ngOnDestroy() {
    if (this.subLogin != undefined){
      this.subLogin.unsubscribe();
    }
  }

}
