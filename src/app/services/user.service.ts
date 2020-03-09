import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  readonly apiURL = environment.apiUrl;

  constructor(private http: HttpClient) { }

  postUser(formData): Observable<any> {
    return this.http.post<any>(this.apiURL + '/user/register', formData)
                    .pipe(catchError(this.errorHandler));
  }

  userLogin(formData): Observable<any>{
    return this.http.post<any>(this.apiURL + '/user/login', formData)
                    .pipe(catchError(this.errorHandler));
  }

  forgotPassword(formData): Observable<any>{
    return this.http.post(this.apiURL + '/user/forgotpassword/', formData)
                    .pipe(catchError(this.errorHandler));
  }

  errorHandler(error) {
    return throwError(error || 'Server Error');
  }
}
