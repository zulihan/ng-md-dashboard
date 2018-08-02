import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../../auth/service/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss']
})
export class MainNavComponent {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(private breakpointObserver: BreakpointObserver,
              private authService: AuthService,
              private toastr: ToastrService) {}

  logout() {
    this.authService.signOut();
      // .then(
      //   () => this.showLogoutSuccess()
      // );
  }

  showLogoutSuccess() {
    this.toastr.success('You\'re logged out ! See you soon');
  }
}
