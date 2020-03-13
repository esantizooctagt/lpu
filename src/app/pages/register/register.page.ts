import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { UserService } from '@services/user.service';
import { FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';
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
  subPaquete: Subscription;
  step: number = 1;
  paquetes$: Observable<any>;
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
    Name: [''],
    Email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
    Password: [''],
    Genero: [''],
    FechaNacimiento: ['']
  });

  paquetesForm = this.fb.group({
    Paquetes: this.fb.array([this.addNewItem(0, '', '', 0, 0)])
  });

  get paque(): FormArray {
    return this.paquetesForm.get("Paquetes") as FormArray
  }

  addNewItem(id: number, titulo: string, descripcion: string, precio: number, selected: number): FormGroup {
    return this.fb.group({
      PaqueteId: id,
      Titulo: titulo,
      Descripcion: descripcion,
      Precio: precio,
      Sel: selected
    })
  }
  
  ngOnInit() {
    this.paquetes$ =this.userService.getPaquetes().pipe(
      map(data => {
        
        let result = JSON.stringify(data).replace(',"error":false', '');
        let result2 = result.replace('"error":false', '');
        let values = JSON.parse(result2);
        let i = 0;
        let paquetes = values[0];
        for (const key of Object.keys(paquetes)) {
          if (i == 0) {
            let res = this.paquetesForm.get('Paquetes') as FormArray;
            res.at(i).patchValue({ PaqueteId: paquetes[key].ID, Titulo: paquetes[key].post_title, Descripcion: paquetes[key].post_content, Precio: paquetes[key].post_excerpt, Sel: 0 });
          } else {
            this.paque.push(this.addNewItem(paquetes[key].ID, paquetes[key].post_title, paquetes[key].post_content, paquetes[key].post_excerpt, 0));
          }
          i++;
        }
        return this.paquetesForm;
      }),
      catchError(err => {
        this.router.navigate(['/home']);
        return throwError(err | err.message);
      })
    );
  }

  onSubmit(){
    const userData = {
      nombre: this.registerForm.controls.Name.value,
      correo: this.registerForm.controls.Email.value,
      contrasena: this.registerForm.controls.Password.value
    }

    const formData = {
      usuario: userData,
      paquete: "45" //{ paquete: "Básico" }
    }
    this.subLogin = this.userService.postUser(formData).subscribe(res => {
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
        this.step = 2;
      }
    });
  }

  setPaquete(index: number, paqueteId: string){
    const userData = {
      correo: this.registerForm.controls.Email.value
    }

    const formData = {
      id: userData,
      token: this.valueToken,
      paquete: "45" //{ rol: "Básico" }
    }
    this.subPaquete = this.userService.postPaqueteUser(this.userCod, formData).subscribe(async res => {
      if (res.error === true){
        this.error = res.msg;
      } else {
        this.error = '';
        await this.presentToast();
      }
    });
  }

  ngOnDestroy() {
    if (this.subLogin != undefined){
      this.subLogin.unsubscribe();
    }
    if (this.subPaquete != undefined){
      this.subPaquete.unsubscribe();
    }
  }

}
