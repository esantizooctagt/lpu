import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { NotasComponent } from '@components/notas/notas.component';
import { UltimahoraComponent } from '@components/ultimahora/ultimahora.component';
import { LocationComponent } from '@app/components/location/location.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ])
  ],
  declarations: [HomePage, NotasComponent, UltimahoraComponent, LocationComponent]
})
export class HomePageModule {}
