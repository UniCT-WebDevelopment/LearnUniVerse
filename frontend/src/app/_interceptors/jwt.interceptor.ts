import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from './../../environments/environment';
import { TokenService } from '../_services';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private tokenService: TokenService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add auth header with jwt if user is logged in and request is to api url
    //const user =  this.authenticationService.userValue;
    const authToken = this.tokenService.authToken;
    const isLoggedIn = this.tokenService.isUserLoggedIn();
    const isApiUrl = request.url.startsWith(environment.UrlApi);
    if (isLoggedIn && isApiUrl) {
      //console.log("TOKEN JWT:",authToken);
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${authToken}`
        }
      });
    }

    return next.handle(request);
  }
}
