import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { UserService } from '@services/user.service';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  error: string = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private storage: Storage,
    private router: Router
  ) { }

  registerForm = this.fb.group({
    Name: [''],
    Email: [''],
    Password: [''],
    Genero: [''],
    FechaNacimiento: ['']
  })

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
    this.userService.postUser(formData).subscribe(res => {
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
        this.router.navigate(['/home']);
      }
    })
  }

}
