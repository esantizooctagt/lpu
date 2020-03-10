import { Component, OnInit } from '@angular/core';
import { NotasService } from '@app/services/notas.service';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
// import { Animation, AnimationController } from '@ionic/core';

@Component({
  selector: 'app-ultimahora',
  templateUrl: './ultimahora.component.html',
  styleUrls: ['./ultimahora.component.scss'],
})
export class UltimahoraComponent implements OnInit {
  notaDesp: number = 0;
  numberNotas: number = 0;
  notas$: Observable<any>;

  constructor(
    private notasService: NotasService
  ) { }

  ngOnInit() {
    this.notas$ = this.notasService.getUltimasNoticias().pipe(
      map(data => {
        let result = JSON.stringify(data).replace(',"error":false','');
        let values = JSON.parse(result);
        let valores =[];
        for (const key of Object.keys(values)) {
          const resultado  =  {
            NotaId: values[key].col_id,
            Titulo: values[key].col_titulo,
            UrlLink: values[key].col_url_fuente
          }
          valores.push(resultado);
        }
        this.numberNotas = valores.length;
        // this.loading.dismiss();
        return valores;
      }),
      catchError(err => {
        // this.loading.dismiss();
        return throwError(err | err.message);
      })
    );

    setInterval(() => {
      this.notaDesp++;
      if (this.notaDesp >= this.numberNotas){
        this.notaDesp = 0;
      }
    }, 18000);
  }

  trackById(index: number, item: any) {
    return item.Titulo;
  }

}