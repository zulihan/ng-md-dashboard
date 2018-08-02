import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { JwtHelperService } from '@auth0/angular-jwt';

import { User } from '../../_models/User';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = 'http://localhost:5000/api/auth/';
  tokenSubject = new Subject<boolean>();
  decodedToken;
  user: Observable<User | null>;
  loginErrorMessage: any;

  constructor(private router: Router,
              private jwtHelperService: JwtHelperService,
              private http: HttpClient) {

  }

  register(username: string, password: string) {
    const model = {
      username,
      password
    };
    return this.http.post(this.baseUrl + 'register', model);

  }

  login(model: any) {
    return this.http.post(this.baseUrl + 'login', model)
      .pipe(
        map( (response: any) => {
          const user = response;
          if (user) {
            localStorage.setItem('token', user.token);
          }
        })
      );
  }

  isLoggedIn(): Observable<boolean> {
    const token = this.jwtHelperService.tokenGetter();
    if (!token) {
      return of(false);
    }
    console.log('called isLoggedIn method in AuthService: ');
    return of(!this.jwtHelperService.isTokenExpired(token));
  }

  // Abilities and Roles Authorization
  // Assign roles to an ability method
  canRead(user: User): boolean {
    const allowed = ['admin', 'runner', 'host'];
    return this.checkAuthorization(user, allowed);
  }

  canEdit(user: User): boolean {
    const allowed = ['admin', 'host'];
    return this.checkAuthorization(user, allowed);
  }

  canDelete(user: User): boolean {
    const allowed = ['admin'];
    return this.checkAuthorization(user, allowed);
  }

  // Determines if user has matching role
  private checkAuthorization(user: User, allowedRoles: string[]): boolean {
    if (!user) {
      return false;
    }
    for (const role of allowedRoles) {
      if ( user.roles[role]) {
        return true;
      }
      return false;
    }
  }

  signOut() {
    localStorage.removeItem('token');
  }

  // If error, console log and notify user
  private handleError(error: Error) {
    this.loginErrorMessage = error.message;
    console.error(error);
    // this.notify.update(error.message, 'error');
  }
}
