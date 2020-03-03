import { Component, OnInit } from '@angular/core';
import { UserService } from '@services/user.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  constructor(
    private fb: FormBuilder,
    private userService: UserService
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
    console.log(this.registerForm.value);
    const formData = {
      nombre: this.registerForm.controls.Name.value,
      correo: this.registerForm.controls.Email.value,
      contrasena: this.registerForm.controls.Password.value
    }
    let datosUsuario = []
    datosUsuario.push(formData);
    let datosPaquete = []
    datosPaquete.push({paquete: "Basic"});

    const form = {
      usuario: datosUsuario,
      paquete: datosPaquete
    }
    this.userService.postUser(form).subscribe(res => {
      console.log(res);
    })
  }

}
