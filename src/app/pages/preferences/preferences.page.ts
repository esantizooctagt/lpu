import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { CategoriesService } from '@services/categories.service';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { MenuService } from '@app/services/menu.service';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.page.html',
  styleUrls: ['./preferences.page.scss'],
})
export class PreferencesPage implements OnInit {
  categories$: Observable<any>;
  items: any[] = [];
  displayForm: boolean = false;
  botonColor: number = 0;
  loading: any;
  prefSet: boolean = false;

  constructor(
    private fb: FormBuilder,
    private storage: Storage,
    private categoriesService: CategoriesService,
    public loadingController: LoadingController,
    private menuService: MenuService,
    private router: Router
  ) {}

  prefForm = this.fb.group({
    Preferences: this.fb.array([this.addNewItem(0, '', '', 0)])
  });

  get userLog(): boolean{
    return this.menuService.userLogged;
  }
  get pref(): FormArray {
    return this.prefForm.get("Preferences") as FormArray
  }

  addNewItem(id: number, name: string, color: string, selected: number): FormGroup {
    return this.fb.group({
      CategoryId: id,
      Nombre: name,
      Color: color,
      Sel: selected
    })
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      message: 'Cargando Preferencias...',
      duration: 3000
    });
    await this.loading.present();
  }

  async ngOnInit() {
    await this.presentLoading();
    this.displayForm = false;

    this.storage.get('user').then((val) => {
      if (val != null) {
        if (val.UserId != '') {
          this.menuService.userLogged = true;
        } else {
          this.menuService.userLogged = false;
        }
      } else {
        this.menuService.userLogged = false;
      }
    });

    this.storage.get('preferences').then((val) => {
      this.categories$ = this.categoriesService.getCategories().pipe(
        map(data => {
          let result = JSON.stringify(data).replace(',"error":false', '');
          let result2 = result.replace('"error":false', '');
          let values = JSON.parse(result2);
          let i = 0;
          for (const key of Object.keys(values)) {
            if (i == 0) {
              let res = this.prefForm.get('Preferences') as FormArray;
              res.at(i).patchValue({ CategoryId: values[key].id, Nombre: values[key].nombre, Color: values[key].color, Sel: 0 });
            } else {
              this.pref.push(this.addNewItem(values[key].id, values[key].nombre, values[key].color, 0));
            }
            i++;
          }
          if (val != null) {
            val.forEach(element => {
              let res = this.prefForm.get('Preferences') as FormArray;
              res.controls.forEach(res => {
                if (res.value.Nombre === element.Nombre) {
                  res.patchValue({ Sel: 1 });
                }
                this.prefSet = true;
              });
              this.botonColor = 1;
            });
          }
          this.loading.dismiss();
          this.displayForm = true;
          return this.prefForm;
        }),
        catchError(err => {
          this.loading.dismiss();
          this.displayForm = true;
          return throwError(err | err.message);
        })
      );
    });
  }

  setPreferences() {
    if (this.prefForm.invalid) {return;}
    let res = this.prefForm.get('Preferences') as FormArray;
    let valores = [];
    res.controls.forEach(res => {
      if (res.value.Sel === 1) {
        valores.push({ Nombre: res.value.Nombre, CategoryId: res.value.CategoryId, Color: res.value.Color });
      }
    });
    this.storage.set('preferences', valores);
    this.router.navigate(['/home']);
  }

  selectedPref(i: number) {
    this.botonColor = 0;
    let sel = 0;
    let res = this.prefForm.get('Preferences') as FormArray;

    if (res.at(i).get('Sel').value === 0) {
      sel = 1;
    }
    res.at(i).patchValue({ Sel: sel });
    let count = 0;
    res.controls.forEach(res => {
      if (res.value.Sel === 1) {
        count++;
      }
    });
    if (count >= 3) {
      this.botonColor = 1;
    }
  }
}
