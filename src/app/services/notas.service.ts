import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  // postTax(formData) {
  //     return this.http.post(this.apiURL + '/tax', formData)
  //                     .pipe(catchError(this.errorHandler));
  // }

  // updateTax(taxId, formData) {
  //   return this.http.patch(this.apiURL + '/tax/'  + taxId, formData)
  //                   .pipe(catchError(this.errorHandler));
  // }

  // deleteTax(taxId) {
  //   return this.http.delete(this.apiURL + '/tax/' + taxId)
  //                   .pipe(catchError(this.errorHandler));
  // }

  errorHandler(error) {
    return throwError(error || 'Server Error');
  }
}