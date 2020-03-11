import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, LoadingController } from '@ionic/angular';
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
  loading: any;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    public loadingController: LoadingController,
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

  async presentLoading() {
    this.loading = await this.loadingController.create({
      message: 'Generando Email...',
      duration: 3000
    });
    await this.loading.present();
  }

  async onSubmit(){
    if (this.forgotForm.invalid) {return;}

    await this.presentLoading();
    const forgot = {
      email: this.forgotForm.get('Email').value
    }

    this.subLogin = this.userService.forgotPassword(forgot).subscribe(async res => {
      if (res.error === true){
        this.loading.dismiss();
        this.error = "No se pudo enviar el correo intente de nuevo";
      } else {
        this.error = '';
        this.loading.dismiss();
        await this.presentToast();
      }
    });
  }

  ngOnDestroy() {
    if (this.subLogin != undefined){
      this.subLogin.unsubscribe();
    }
  }
}
