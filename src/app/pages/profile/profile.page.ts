import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  user: any;
  nombre: string = '';
  email: string = '';
  constructor(
    private storage: Storage,
    private router: Router
  ) { }

  ngOnInit() {
    this.storage.get('user').then((val) => {
      if (val != null) {
        this.nombre = val.Nombre;
        this.email = val.Email;
      }
    });
  }

  onSubmit(){
    this.storage.remove('user').then((val) => {
      if (val === undefined){
        this.router.navigate(['/home']);
        console.log('todo ok');
      }

    })
  }
}
