import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PrefGuard implements CanActivate {

  constructor(
    private router: Router,
    private storage: Storage  
  ) { }
  
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {       
      return this.storage.get('preferences').then((val) => {
          if (val != null) {
            return true;
          } else {
            this.router.navigate(['/preferences']);
            return false;
          }
        }, error => {
          this.router.navigate(['/preferences']);
          return false;
        });
  }
  
}
