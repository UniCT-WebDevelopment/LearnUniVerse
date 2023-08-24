import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  private loading = new Subject<boolean>();

  constructor() {
    //console.log("LoaderService.constructor");
    this.loading.next(false);
  }

  setLoading(loading: boolean) {
    this.loading.next(loading);
  }

  getLoading(): Subject<boolean> {
    //console.log("LoaderService.getLoading", this.loading);
    return this.loading;
  }
}
