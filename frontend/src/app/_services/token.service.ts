import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private authTokenSubject: BehaviorSubject<string | null>;
  private userSubject: BehaviorSubject<any>;

  constructor(
    private router: Router
  ) {
    this.authTokenSubject = new BehaviorSubject<string | null>(localStorage.getItem('AuthToken'));
    this.userSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('User') as string));
  }

  isUserLoggedIn() {
    return this.authToken != null;
  }

  public get authToken(): string | null {
    return this.authTokenSubject.value;
  }

  public get user(): any {
    return this.userSubject.value;
  }

  public get userId() {
    let payload = window.atob(this.authToken?.split(".")[1] as string);

    let obj = JSON.parse(payload);

    console.log("payload", payload);
    console.log("obj", obj);
    return obj.id;
  }

  saveUser(user: any) {
    localStorage.setItem('User', JSON.stringify(user));
    this.userSubject.next(user);
  }

  saveAuthToken(authToken: string) {
    localStorage.setItem('AuthToken', authToken);
    this.authTokenSubject.next(authToken);
  }

  deleteAll() {
    localStorage.removeItem('AuthToken');
    this.authTokenSubject.next(null);

    localStorage.removeItem('User');
    this.userSubject.next(null);
  }

}

