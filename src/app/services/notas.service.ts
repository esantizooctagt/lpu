import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotasService {

  readonly apiURL = environment.apiUrl;
  constructor(private http: HttpClient) { }

  getNotas(searchValue): Observable<any> {
    return this.http.get<any>(this.apiURL + '/busqueda/?buscando=' + searchValue)
                    .pipe(catchError(this.errorHandler));
  }

  getNotasFiltros(tipo, categoria, pais): Observable<any>{
    return this.http.get<any>(this.apiURL + '/noticias/?tipo='+tipo+'&categoria='+categoria+'&pais=&limit=50')
                    .pipe(catchError(this.errorHandler));
  }

  getUltimasNoticias(): Observable<any>{
    return this.http.get<any>(this.apiURL + '/ultimas-noticias')
                    .pipe(catchError(this.errorHandler));
  }

  postBookmark(formData): Observable<any>{
    return this.http.post<any>(this.apiURL + '/follow', formData)
                    .pipe(catchError(this.errorHandler));
  }

  delBookmark(formData): Observable<any>{
    return this.http.put<any>(this.apiURL + '/follow', formData)
                    .pipe(catchError(this.errorHandler));
  }

  errorHandler(error) {
    return throwError(error || 'Server Error');
  }
}