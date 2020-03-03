import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { UserService } from '@app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) { }

  loginForm = this.fb.group({
    Email: [''],
    Password: ['']
  })

  ngOnInit() {
  }

  onSubmit(){
    console.log(this.loginForm.value);
    const formData = {
      nombre: this.loginForm.controls.Name.value,
      correo: this.loginForm.controls.Email.value,
      contrasena: this.loginForm.controls.Password.value
    }
    let datosUsuario = []
    datosUsuario.push(formData);
    let datosPaquete = []
    datosPaquete.push({paquete: "Premium"});

    const form = {
      usuario: datosUsuario,
      paquete: datosPaquete
    }
    this.userService.postUser(form).subscribe(res => {
      console.log(res);
    })
  }
}
