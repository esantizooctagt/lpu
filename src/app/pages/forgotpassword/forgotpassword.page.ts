import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from '@app/services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.page.html',
  styleUrls: ['./forgotpassword.page.scss'],
})
export class ForgotpasswordPage implements OnInit {
  public error: string = '';
  subLogin: Subscription;
  
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    public toastController: ToastController
  ) { }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Favor revise su bandeja de entrada.',
      duration: 2000,
      color: "primary"
    });

    toast.onDidDismiss().then(_ => {
      this.router.navigate(['/home']);
    })
    toast.present();
  }

  forgotForm = this.fb.group({
    Email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]]
  })

  ngOnInit() {
  }

  async onSubmit(){
    if (this.forgotForm.invalid) {return;}

    const forgot = {
      email: this.forgotForm.get('Email').value
    }

    this.subLogin = this.userService.forgotPassword(forgot).subscribe(async res => {
      console.log('resultado forgot');
      console.log(res);
      if (res.error === true){
        this.error = "Invalid credentials";
      } else {
        this.error = '';
        await this.presentToast();
      }
    });
  }

  ngOnDestroy() {
    this.subLogin.unsubscribe();
  }
}
