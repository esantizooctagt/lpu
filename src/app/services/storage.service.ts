import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  preferencesSet: boolean = false;
  userSet: boolean = false;
  constructor(
    private storage: Storage
  ) { }

  async getPreferences() {
    return await new Promise((resolve) => { 
      this.storage.get('preferences').then((val) => {
        if (val != null) {
          this.preferencesSet = true;
          resolve(this.preferencesSet);
        } else {
          resolve(this.preferencesSet);
        }
      });
    });
  }

  async getUser() {
    return await new Promise((resolve) => { 
      this.storage.get('user').then((val) => {
        if (val != null) {
          this.userSet = true;
          resolve(this.userSet);
        } else {
          resolve(this.userSet);
        }
      });
    });
  }

}
