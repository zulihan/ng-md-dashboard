import { Component, OnInit, Inject, Injectable } from '@angular/core';
import { FormGroup, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material';

import { map, take, debounceTime } from 'rxjs/operators';

import { AuthService } from '../service/auth.service';

import { ToastrService } from 'ngx-toastr';

import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  state: string;
  error: any;
  registerForm: FormGroup;
  roles = ['admin', 'host', 'runner'];
  emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<RegisterComponent>) {}

    onNoClick(): void {
      this.dialogRef.close();
    }

  ngOnInit() {
    this.createRegisterForm();
  }

  createRegisterForm() {
    this.registerForm = this.fb.group({
      // email: [null, [Validators.required, Validators.pattern(this.emailPattern)]],
      username: [null, [Validators.required, Validators.minLength(2)]],
      // phone: [null, [Validators.required, Validators.minLength(10), , Validators.maxLength(10)]],
      role: ['runner'],
      password: [null, [Validators.required, Validators.minLength(6)]],
      confirmPassword: [null, [Validators.required, Validators.minLength(6)]]
    }, {validator: this.passwordMatchValidator});
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password').value === g.get('confirmPassword').value ? null : {'mismatch': true};
  }

  onSubmit() {
    const username = this.registerForm.value.username;
    const password = this.registerForm.value.password;
    this.authService.register(username, password).subscribe( () => {
      this.showRegisterSuccess(username);
      console.log(this.registerForm.value.username);
    }, error => {
      console.log(error);
      this.showRegisterError(error);
    });
  }

  showRegisterSuccess(username) {
    this.toastr.success('You\'ve susccesfully registered user ' + username);
  }

  showRegisterError(response) {
    this.toastr.error(response.error);
  }

}
