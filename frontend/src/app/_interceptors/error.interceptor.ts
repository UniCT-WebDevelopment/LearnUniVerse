import { Injectable, Injector } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { TokenService } from '../_services';
import { Router, RouterStateSnapshot } from '@angular/router';
import { alert } from 'devextreme/ui/dialog';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private tokenService: TokenService,
    private injector: Injector
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
      if ([401, 403].indexOf(err.status) !== -1 && !err.url.includes("logout")) {
        this.tokenService.deleteAll();
        var router = this.injector.get(Router);
        var state = router.routerState.snapshot;
        router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      }

      if (err.status >= 400 && err.status <= 499 && err.error) {
        alert(err.error, "Errore");
      }

      const error = err.error?.message || err.statusText;
      return throwError(error);
    }))
  }
}
