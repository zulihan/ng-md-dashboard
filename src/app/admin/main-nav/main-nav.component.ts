import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../../auth/service/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss']
})
export class MainNavComponent implements OnInit {
  photoUrl: string;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(private breakpointObserver: BreakpointObserver,
    public authService: AuthService,
              private toastr: ToastrService) {}

  ngOnInit() {
    this.authService.currentPhotoUrl.subscribe(photoUrl => {
      this.photoUrl = photoUrl;
    });
  }

  logout() {
    this.authService.signOut();
    this.authService.decodedToken = null;
    this.authService.currentUser = null;
    this.showLogoutSuccess();
      // .then(
      //   () => this.showLogoutSuccess()
      // );
  }

  showLogoutSuccess() {
    this.toastr.success('You\'re logged out ! See you soon');
  }
}
