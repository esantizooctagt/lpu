import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { UserService } from '@services/user.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, throwError, Observable } from 'rxjs';
import { ToastController } from '@ionic/angular';
import { map, catchError } from 'rxjs/operators';

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
  paqueteId: string ='';
  valueToken: string = '';
  userCod: number;
  
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private storage: Storage,
    private router: Router,
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

  onSubmit(){
    if (this.paqueteId == '') { return; }
    const userData = {
      nombre: this.registerForm.controls.Name.value,
      correo: this.registerForm.controls.Email.value,
      contrasena: this.registerForm.controls.Password.value
    }

    const formData = {
      usuario: userData,
      paquete: this.paqueteId
    }
    this.subLogin = this.userService.postUser(formData).subscribe(async res => {
      if (res.error === true){
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

  setPaquete(index: number, paqueteId: string){
    this.paqueteId = paqueteId;
    for (let i = 0; i < this.paquetes.length; i++) {
      if (this.paquetes[i].PaqueteId != this.paqueteId){
        this.paquetes[i].Sel= false;
      } else {
        this.paquetes[i].Sel = true;
      }
    }
  }

  ngOnDestroy() {
    if (this.subLogin != undefined){
      this.subLogin.unsubscribe();
    }
  }

}
