import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from '../service/auth.service';

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

  constructor(private fb: FormBuilder, private authService: AuthService) {}

  ngOnInit() {
    this.createRegisterForm();
  }

  // createRegisterForm(){
  //   this.registerForm = this.fb.group({
  //     email: [null, [Validators.required, Validators.pattern(this.emailPattern)]],
  //     phone: [null, [Validators.required, Validators.minLength(10), , Validators.maxLength(10)]],
  //     password: [null, [Validators.required, Validators.minLength(6)]],
  //     confirmPassword: [null, [Validators.required]],
  //     roles: ['runner']
  //   }, {validator: this.passwordMatchValidator});
  // }

  createRegisterForm() {
    this.registerForm = this.fb.group({
      email: [null, [Validators.required, Validators.pattern(this.emailPattern)]],
      password: [null, [Validators.required, Validators.minLength(6)]],
      confirmPassword: [null, [Validators.required]]
    }, {validator: this.passwordMatchValidator});
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password').value === g.get('confirmPassword').value ? null : {'mismatch': true};
  }

  onSubmit() {
    const email = this.registerForm.value.email;
    const password = this.registerForm.value.password;
    this.authService.emailSignUp(email, password);
    console.log(this.registerForm.value.email);
  }

}
