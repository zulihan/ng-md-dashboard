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
  venues = [
    {name: 'Open Air', id: 1},
    {name: 'Grand Palais' , id: 2},
    {name: 'Palais Phocéen', id: 3},
    {name: 'Not set yet', id: 4},
   ];
  days = [
    {number: '1', id: 1},
    {number: '2', id: 2},
    {number: '3', id: 3},
    {number: 'Not set yet', id: 4}
  ];
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
      name: ['', [Validators.required, Validators.minLength(2)]],
      photoUrl: ['', [Validators.nullValidator]],
      contactName: ['', [Validators.required, Validators.minLength(2)]],
      contactEmail: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
      contactPhone: ['', [Validators.minLength(10), Validators.maxLength(10)]],
      onRoad: ['', [Validators.nullValidator]],
      onStage: ['', [Validators.nullValidator]],
      venue: [4, [Validators.nullValidator]],
      day: [4, [Validators.nullValidator]],
      showTimeStart: ['', [Validators.nullValidator]],
      showTimeEnd: ['', [Validators.nullValidator]],
      getInStart: ['', [Validators.nullValidator]],
      getInEnd: ['', [Validators.nullValidator]],
      setupStart: ['', [Validators.nullValidator]],
      setupEnd: ['', [Validators.nullValidator]],
      soundCheckStart: ['', [Validators.nullValidator]],
      soundCheckEnd: ['', [Validators.nullValidator]]
    });
  }

  onSubmit() {
    const formValue = this.registerForm.value;
    console.log('form value: ', formValue);
    console.log('getIn :', formValue.getInStart);
    const name = formValue.name;
    const photoUrl = formValue.photoUrl;
    const contactName = formValue.contactName;
    const contactEmail = formValue.contactEmail;
    const contactPhone = formValue.contactPhone;
    const onRoad = +formValue.onRoad;
    const onStage = +formValue.onStage;
    const venueId = +formValue.venue;
    const dayId = +formValue.day;
    const getIn = {
      dayId: +dayId,
      venueId: +formValue.venue,
      start: formValue.getInStart,
      end: formValue.getInEnd
    };
    const setUpWings = {
      dayId: +dayId,
      venueId: +formValue.venue,
      start: formValue.setupStart,
      end: formValue.setupEnd
    };
    const soundCheck = {
      dayId: +dayId,
      venueId: +formValue.venue,
      start: formValue.soundCheckStart,
      end: formValue.soundCheckEnd
    };
    const show = {
      dayId: +dayId,
      venueId: +formValue.venue,
      start: formValue.showTimeStart,
      end: formValue.showTimeEnd
    };
    const model = {
      name,
      photoUrl,
      contactName,
      contactEmail,
      contactPhone,
      onRoad,
      onStage,
      venueId,
      dayId,
      getIn,
      setUpWings,
      soundCheck,
      show
    };
    // console.log('model to send: ', JSON.stringify(model));
    this.artistsService.registerArtist(model)
      .subscribe( (response) => {
        this.artistsService.artistList.push(response);
        this.artistsService.artistListSubject.next(this.artistsService.artistList);
        this.showRegisterSuccess(model.name);
        console.log('response: ', response);
      }, error => {
        console.log(error);
        this.showRegisterError(error);
      });
  }

  showRegisterSuccess(name) {
    this.toastr.success('You\'ve susccesfully registered artist ' + name);
  }

  showRegisterError(response) {
    this.toastr.error(response);
  }

}
