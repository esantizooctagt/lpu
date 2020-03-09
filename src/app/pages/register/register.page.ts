import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { UserService } from '@services/user.service';
import { FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastController } from '@ionic/angular';

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

  get pref(): FormArray {
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
  }

  onSubmit(){
    const userData = {
      nombre: this.registerForm.controls.Name.value,
      correo: this.registerForm.controls.Email.value,
      contrasena: this.registerForm.controls.Password.value
    }

    const formData = {
      usuario: userData,
      paquete: { paquete: "Básico" }
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
          Gustos: res.user.gustos
        }
        this.storage.set('user', data);
        this.step = 2;
      }
    });
  }

  setPaquete(index: number, paqueteId: string){
    this.subPaquete = this.userService.postPaqueteUser(paqueteId).subscribe(async res => {
      if (res.error === true){
        this.error = res.msg;
      } else {
        this.error = '';
        await this.presentToast();
      }
    });
  }

  ngOnDestroy() {
    this.subLogin.unsubscribe();
    this.subPaquete.unsubscribe();
  }

}
