import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { finalize, map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private headers = { 'content-type': 'application/json' };

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private router: Router
  ) {
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(
      environment.UrlApi + '/Authentication/login',
      { username, password },
      { 'headers': this.headers }
    ).pipe(map((x) => {
      this.tokenService.saveAuthToken(x.token);
      this.fetchUpdatedUser().subscribe();
      return x;
    }));
  }


  register(username: string, password: string): Observable<any> {
    return this.http.post<any>(
      environment.UrlApi + '/Auth/userLogin',
      { username, password },
      { 'headers': this.headers }
    ).pipe(map((x) => {
      if (!x.isError) {
        this.tokenService.saveAuthToken(x.data.authToken);
      }
      return x;
    }));
  }

  fetchUpdatedUser(): Observable<any> {
    return this.http.get<any>(
      environment.UrlApi + '/Utente/UtenteDetail',
      { 'headers': this.headers, params: { id: this.tokenService.userId } }
    ).pipe(map((x) => {
      if (!x.isError) {
        this.tokenService.saveUser(x);
      }
      return x;
    }));
  }

  logout() {
    console.log("LOGOUT")
    this.tokenService.deleteAll();
    this.router.navigate(['/login']);
    // return this.http.post<any>(
    //   environment.UrlApi + '/Auth/userLogout',
    //   { 'headers': this.headers }
    // ).pipe(
    //   finalize(() => {
    //     console.log("DELETE ALL");

    //   })
    // );
  }


}

