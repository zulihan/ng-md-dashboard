import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from '../auth/service/auth.service';
import { User } from '../_models/User';

// import { AuthService } from '../core/auth/auth.service';
// import { Observable } from '../../../node_modules/rxjs';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  @Input() isLoggedIn: boolean;
  jwtHelper = new JwtHelperService();

  constructor(private router: Router,
    private location: Location,
    private authService: AuthService) {
  }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const user: User = JSON.parse(localStorage.getItem('user'));
    if (token) {
      this.authService.decodedToken = this.jwtHelper.decodeToken(token);
    }
    if (user) {
      this.authService.currentUser = user;
      this.authService.changeUserPhoto(user.photoUrl);
      // if (user.photoUrl != null) {
      //   this.authService.changeUserPhoto(user.photoUrl);
      // } else {
      //   const photoUrl = '../../../assets/img/person.svg';
      //   this.authService.changeUserPhoto(photoUrl);
      // }

    }
  }

  goBack(): void {
    this.location.back();
  }
}
