import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuService } from '@app/services/menu.service';
import { UserService } from '@app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  error: string = '';
  showMenu: boolean = false;
  constructor(
    private fb: FormBuilder,
    private menuService: MenuService,
    private userService: UserService,
    private storage: Storage,
    private router: Router
  ) { }

  loginForm = this.fb.group({
    Email: [''],
    Password: ['']
  })

  ngOnInit() {
    this.storage.get('preferences').then((val) => {
      if (val != null) {
        this.showMenu = true;
      } else {
        this.showMenu = false;
      }
    }, error => {
      this.showMenu = false;
    });
  }

  onSubmit(){
    if (this.loginForm.invalid) { return;}
    this.error = '';
    const formData = {
      usuario: this.loginForm.controls.Email.value,
      contrasena: this.loginForm.controls.Password.value
    }
    this.userService.userLogin(formData).subscribe(res => {
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
          Gustos: res.user.gustos
        }
        this.storage.set('user', data);
        this.menuService.userLogged = true;
        this.router.navigate(['/home']);
      }
    })
  }
}
