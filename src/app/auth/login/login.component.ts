import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { Router } from '@angular/router';
import { AlertifyService } from '../../_services/alertify.service';
// import { Observable } from 'rxjs/Observable';
// import { Subscription } from 'rxjs';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @Input() isLoggedIn: boolean;
  loggedIn;
  error: any;
  loginForm: FormGroup;
  loggingErrorMessage = '';
  emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService
    ) {
      // this.loggedIn = this.authService.tokenSubject.subscribe(
      //   (value: boolean) => value
      // )
      // this.loggedIn = this.authService.isLoggedIn()
      // .subscribe(res => {
      //   console.log('LoggedIn?',res);
      //   this.loggedIn = res;
      // });
  }

  ngOnInit() {
    this.createLoginForm();
  }

  createLoginForm() {
    this.loginForm = this.fb.group({
      // email: [null, [Validators.required, Validators.pattern(this.emailPattern)]],
      name: [null, [Validators.required, Validators.minLength(2)]],
      password: [null, [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    console.log(this.loginForm.value);
    // const email = this.loginForm.value.email;
    const name = this.loginForm.value.name;
    const password = this.loginForm.value.password;
    this.authService.login(name, password)
      .subscribe(
        next => {
          console.log('logged in');
          this.showLoginSuccess();
          // this.alertify.success('logged in successfully');
          this.router.navigate(['/']);
        },
        error => {
          console.log(error.message);
          this.showLoginError(error.message);
          this.loggingErrorMessage = error.message;
      }
    );
  }

  showLoginSuccess() {
    this.toastr.success('You\'re susccesfully logged in !');
  }

  showLoginError(error) {
    this.toastr.error(error);
  }

  logout() {
    this.authService.signOut();
    // this.alertify.message('logged out');
  }

}
