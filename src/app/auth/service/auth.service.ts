import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import * as firebase from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import { of, Subject } from 'rxjs';
import { User } from '../../_models/User';
// import { take, map, tap } from 'rxjs/operators';

import { JwtHelperService } from '@auth0/angular-jwt';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  tokenSubject = new Subject<boolean>();
  decodedToken;
  user: Observable<User | null>;
  loginErrorMessage: any;

  constructor(private afAuth: AngularFireAuth,
              private afs: AngularFirestore,
              private router: Router,
              private jwtHelperService: JwtHelperService) {

    this.user = this.afAuth.authState
                .switchMap(user => {
                  if (user) {
                    return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
                } else {
                  return of(null);
                }
              });
  }

  // isLoggedIn(): Observable<boolean> {
  //   return this.afAuth.authState.map((auth) =>  {
  //         if(auth == null) {
  //           return false;
  //         } else {
  //           return true;
  //         }
  //   });
  // }

// Good one
  // isLoggedIn() {
  //   return this.user.pipe(
  //     take(1),
  //     map(user => !!user),
  //     tap(loggedIn => {
  //       if (!loggedIn) {
  //         return false
  //       }
  //     return true
  //     })
  //   )
  // }

  isLoggedIn(): Observable<boolean> {
    const token = this.jwtHelperService.tokenGetter();
    if (!token) {
      return of(false);
    }
    console.log('called isLoggedIn method in AuthService: ');
    return of(!this.jwtHelperService.isTokenExpired(token));
  }

  emailSignUp(email: string, password: string) {
    return this.afAuth.auth
      .createUserWithEmailAndPassword(email, password)
      .then(credential => {
        // this.notify.update('Welcome new user!', 'success');
        return this.updateUserData(credential.user); // if using firestore
      })
      .catch(error => this.handleError(error));
  }

  emailLogin(email: string, password: string) {
    return this.afAuth.auth
      .signInWithEmailAndPassword(email, password)
      .then(
        credential => {
          // this.notify.update('Welcome back!', 'success');
          console.log('credential', credential);
          credential.user.getIdToken()
            .then(
              tk => {
                // console.log('token from authService:', JSON.stringify(tk));
                // console.log("this", this);
                // this.token.next(tk);
                localStorage.setItem('token', JSON.stringify(tk));
                this.decodedToken = this.jwtHelperService.decodeToken(JSON.stringify(tk));
                console.log('decoded token:', this.decodedToken);
              }
            );
        }
      );
      // .catch(error => this.handleError(error));
  }


  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.oAuthLogin(provider);
  }

  private oAuthLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((credential) => {
        this.updateUserData(credential.user);
      });
  }

  // Sets user data to Firestore on login
  private updateUserData(user) {

    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);

    const data: User = {
      uid: user.uid,
      email: user.email
    };

    return userRef.set(data, {merge: true });

  }

  // phone: user.phone,
  //     displayName: user.displayName,
  //     photoUrl: user.photoUrl,
  //     roles: {
  //       runner: true
  //     }

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
    return this.afAuth.auth.signOut()
      .then((x) => {
        console.log(x);
    //     localStorage.removeItem('token');
        this.router.navigate(['login']);
    });
  }

  // If error, console log and notify user
  private handleError(error: Error) {
    this.loginErrorMessage = error.message;
    console.error(error);
    // this.notify.update(error.message, 'error');
  }
}
