import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material';



import { ToastrService } from 'ngx-toastr';
import { ArtistsService } from '../service/artists.service';

@Component({
  selector: 'app-artists-register',
  templateUrl: './artists-register.component.html',
  styleUrls: ['./artists-register.component.scss']
})
export class ArtistsRegisterComponent implements OnInit {

  error: any;
  registerForm: FormGroup;
  emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';
  venues = ['Open Air', 'Grand Palais', 'Palais Phocéen'];
  days = ['1', '2', '3'];
  roles = ['admin', 'host', 'runner'];

  constructor(
    private fb: FormBuilder,
    private artistsService: ArtistsService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<ArtistsRegisterComponent>
  ) { }

  ngOnInit() {
    this.createRegisterForm();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  createRegisterForm() {
    this.registerForm = this.fb.group({
      name: [null, [Validators.required, Validators.minLength(2)]],
      photoUrl: [null, [Validators.nullValidator]],
      contactName: [null, [Validators.required, Validators.minLength(2)]],
      contactEmail: [null, [Validators.required, Validators.pattern(this.emailPattern)]],
      contactPhone: [null, [Validators.minLength(10), Validators.maxLength(10)]],
      onRoad: [null, [Validators.nullValidator]],
      onStage: [null,[Validators.nullValidator]],
      venue: [null, [Validators.nullValidator]],
      day: [null, [Validators.nullValidator]],
      showTimeStart: [null, [Validators.nullValidator]],
      showTimeEnd: [null, [Validators.nullValidator]],
      getInStart: [null, [Validators.nullValidator]],
      getInEnd: [null, [Validators.nullValidator]],
      setupStart: [null, [Validators.nullValidator]],
      setupEnd: [null, [Validators.nullValidator]],
      soundCheckStart: [null, [Validators.nullValidator]],
      soundCheckEnd: [null, [Validators.nullValidator]]
    });
  }

  onSubmit() {
    console.log(this.registerForm);
    // const name = this.registerForm.value.name;
    // this.artistsService.register(this.registerForm.value).subscribe( () => {
    //   this.showRegisterSuccess(name);
    //   console.log(this.registerForm.value);
    // }, error => {
    //   console.log(error);
    //   this.showRegisterError(error);
    // });
  }

  showRegisterSuccess(name) {
    this.toastr.success('You\'ve susccesfully registered user ' + name);
  }

  showRegisterError(response) {
    this.toastr.error(response.error);
  }

}
