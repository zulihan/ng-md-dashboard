import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of, Subject, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { JwtHelperService } from '@auth0/angular-jwt';

import { User } from '../../_models/User';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl = environment.apiUrl + 'auth/';
  tokenSubject = new Subject<boolean>();
  jwtHelper = new JwtHelperService();
  decodedToken: any;
  user: Observable<User | null>;
  loginErrorMessage: any;
  currentUser: User;
  photoUrl = new BehaviorSubject<string>('../../../assets/img/person.svg');
  currentPhotoUrl = this.photoUrl.asObservable();

  constructor(private router: Router,
              private jwtHelperService: JwtHelperService,
              private http: HttpClient) {

  }

  changeUserPhoto(photoUrl: string) {
    this.photoUrl.next(photoUrl);
  }

  register(model) {
    return this.http.post(this.baseUrl + 'register', model);
  }

  login(username, password) {
    const model = {
      username,
      password
    };
    return this.http.post(this.baseUrl + 'login', model)
      .pipe(
        map( (response: any) => {
          const user = response;
          console.log('user from login response', user);
          if (user) {
            localStorage.setItem('token', user.token);
            this.decodedToken = this.jwtHelper.decodeToken(user.token);
            localStorage.setItem('user', JSON.stringify(user.user));
            this.currentUser = user.user;
            this.changeUserPhoto(this.currentUser.photoUrl);
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
      if ( user.role[role]) {
        return true;
      }
      return false;
    }
  }

  signOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  // If error, console log and notify user
  private handleError(error: Error) {
    this.loginErrorMessage = error.message;
    console.error(error);
    // this.notify.update(error.message, 'error');
  }
}
