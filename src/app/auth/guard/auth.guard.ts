import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { AuthService} from '../service/auth.service';
import { Observable } from 'rxjs';
// import { map, take } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate {

  loggedIn;

  constructor(private authService: AuthService, private router: Router) {}


  canActivate(_next: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    this.authService.isLoggedIn().subscribe(
      (value: boolean) => this.loggedIn = value
    );
    if (this.loggedIn  === false) {
      this.router.navigate(['/login']);  // {4}
      return false;
    } else {
      return true;
    }

    // return this.authService.user.pipe(
      //      take(1),
      //      map(user => !!user),
      //      tap(loggedIn => {
      //        if (!loggedIn) {
      //          console.log('access denied')
      //          this.router.navigate(['/login']);
      //        }
      //    })
      // )
  }
}
