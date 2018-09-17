import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { ToastrService } from 'ngx-toastr';
import { ArtistsService } from '../service/artists.service';
import { Venue } from '../../../_models/venue';
import { Artist } from '../../../_models/artist';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-artist-edit',
  templateUrl: './artist-edit.component.html',
  styleUrls: ['./artist-edit.component.scss']
})
export class ArtistEditComponent implements OnInit, OnDestroy {

  editForm: FormGroup;
  emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';
  venues: Venue[];
  days = [
    {id: 1, name: '1'},
    {id: 2, name: '2'},
    {id: 3, name: '3'},
    {id: 4, name: 'Not Set Yet'}
  ];
  artistToEdit: Artist;
  artistSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private artistsService: ArtistsService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<ArtistEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }


  ngOnInit() {
    // this.artistToEdit = this.data.dataKey;
    this.artistSubscription = this.artistsService.afterEditArtist.subscribe(artist => this.artistToEdit = artist);
    this.createEditForm();
    this.artistsService.getVenues().subscribe(venues => this.venues = venues);
    // console.log('artist to edit: ', this.data.dataKey);
    console.log('artist to edit: ', this.artistToEdit);
    console.log('editForm: ', this.editForm);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  createEditForm() {
    this.editForm = this.fb.group({
      name: [this.artistToEdit.name, [Validators.required, Validators.minLength(2)]],
      photoUrl: [this.artistToEdit.photoUrl, [Validators.nullValidator]],
      contactName: [this.artistToEdit.contactName, [Validators.required, Validators.minLength(2)]],
      contactEmail: [this.artistToEdit.contactEmail, [Validators.required, Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])]],
      contactPhone: [this.artistToEdit.contactPhone, [Validators.minLength(10), Validators.maxLength(10)]],
      onRoad: [this.artistToEdit.onRoad, [Validators.nullValidator]],
      onStage: [this.artistToEdit.onStage, [Validators.nullValidator]],
      venue: [this.artistToEdit.venueId, [Validators.nullValidator]],
      day: [this.artistToEdit.dayId, [Validators.nullValidator]],
      showTimeStart: [this.artistToEdit.show != null ? this.artistToEdit.show.start : null,
         [Validators.nullValidator]],
      showTimeEnd: [this.artistToEdit.show != null ? this.artistToEdit.show.end : null,
         [Validators.nullValidator]],
      getInStart: [this.artistToEdit.getIn != null ? this.artistToEdit.getIn.start : null,
         [Validators.nullValidator]],
      getInEnd: [this.artistToEdit.getIn != null ? this.artistToEdit.getIn.end : null,
         [Validators.nullValidator]],
      setupStart: [this.artistToEdit.setUpWings != null ? this.artistToEdit.setUpWings.start : null,
         [Validators.nullValidator]],
      setupEnd: [this.artistToEdit.setUpWings != null ? this.artistToEdit.setUpWings.end : null,
         [Validators.nullValidator]],
      soundCheckStart: [this.artistToEdit.soundCheck != null ? this.artistToEdit.soundCheck.start : null,
         [Validators.nullValidator]],
      soundCheckEnd: [this.artistToEdit.soundCheck != null ? this.artistToEdit.soundCheck.end : null,
         [Validators.nullValidator]]
    });
  }

  onSubmit() {
    const formValue = this.editForm.value;
    const timezoneOffset = new Date().getTimezoneOffset() * 60000;
    console.log('timezoneOffset: ', timezoneOffset);
    console.log('form value: ', formValue);
    const getInTest = new Date(formValue.getInStart - timezoneOffset).toISOString().slice(0, -1);
    console.log('getInTest :', typeof(getInTest));
    const name = formValue.name;
    const photoUrl = formValue.photoUrl;
    const contactName = formValue.contactName;
    const contactEmail = formValue.contactEmail;
    const contactPhone = formValue.contactPhone;
    const onRoad = formValue.onRoad;
    const onStage = formValue.onStage;
    const venue = formValue.venue.name;
    const venueId = formValue.venue.id;
    const dayId = +formValue.day;
    const getInStart = formValue.getInStart != null || undefined ?
      new Date(formValue.getInStart - timezoneOffset).toISOString().slice(0, -1) : null;
    const getInEnd = formValue.getInEnd != null || undefined ?
      new Date(formValue.getInEnd - timezoneOffset).toISOString().slice(0, -1) : null;
    const setupStart = formValue.setupStart != null || undefined ?
      new Date(formValue.setupStart - timezoneOffset).toISOString().slice(0, -1) : null;
    const setupEnd = formValue.setupEnd != null || undefined ?
      new Date(formValue.setupEnd - timezoneOffset).toISOString().slice(0, -1) : null;
    const soundCheckStart = formValue.soundCheckStart != null || undefined ?
      new Date(formValue.soundCheckStart - timezoneOffset).toISOString().slice(0, -1) : null;
    const soundCheckEnd = formValue.soundCheckEnd != null || undefined ?
      new Date(formValue.soundCheckEnd - timezoneOffset).toISOString().slice(0, -1) : null;
    const showTimeStart = formValue.showTimeStart != null || undefined ?
      new Date(formValue.showTimeStart - timezoneOffset).toISOString().slice(0, -1) : null;
    const showTimeEnd = formValue.showTimeEnd != null || undefined ?
      new Date(formValue.showTimeEnd - timezoneOffset).toISOString().slice(0, -1) : null;

    const model = {
      name,
      photoUrl,
      hotel: null,
      contactName,
      contactEmail,
      contactPhone,
      onRoad,
      onStage,
      venue,
      venueId,
      dayId,
      getIn : {
        artistId: this.artistToEdit.id,
        dayId,
        venueId,
        start: getInStart,
        end: getInEnd
      },
      setUpWings : {
        artistId: this.artistToEdit.id,
        dayId,
        venueId,
        start: setupStart,
        end: setupEnd
      },
      soundCheck : {
        artistId: this.artistToEdit.id,
        dayId,
        venueId,
        start: soundCheckStart,
        end: soundCheckEnd
      },
      show : {
        artistId: this.artistToEdit.id,
        dayId,
        venueId,
        start: showTimeStart,
        end: showTimeEnd
      }
    };
    console.log('model to send: ', model);
    console.log('show start', model.show.start);
    console.log('show end', model.show.end);
    console.log('getin start', typeof(getInStart));
    console.log('getin end', model.getIn.end);

    this.artistsService.editArtist(this.artistToEdit.id, model)
      .subscribe( (response) => {
        this.artistsService.updateArtistAfterEdit(this.artistToEdit.id, model);
        console.log('response from artistsService.editArtist', response);
        this.showEditSuccess(model.name.toUpperCase());
        // console.log(model);
      }, error => {
        console.log(error);
        this.showEditError(error);
      });
  }

  showEditSuccess(name) {
    this.toastr.success('You\'ve susccesfully edited artist ' + name);
  }

  showEditError(response) {
    this.toastr.error(response.error);
  }

  ngOnDestroy() {
    this.artistSubscription.unsubscribe();
  }

}

    // const getInStart = new Date(formValue.getInStart);
    // const getInEnd = new Date(formValue.getInEnd);
    // const setupStart = new Date(formValue.setupStart);
    // const setupEnd = new Date(formValue.setupEnd);
    // const soundCheckStart = new Date(formValue.soundCheckStart);
    // const soundCheckEnd = new Date(formValue.soundCheckEnd);
    // const showTimeStart = new Date(formValue.showTimeStart);
    // const showTimeEnd = new Date(formValue.showTimeEnd);

    // const getIn = {
    //   artistId: this.artistToEdit.id,
    //   dayId,
    //   venueId: formValue.venue,
    //   start: getInStart,
    //   end: getInEnd
    // };
    // const setUpWings = {
    //   artistId: this.artistToEdit.id,
    //   dayId,
    //   venueId,
    //   start: setupStart,
    //   end: setupEnd
    // };
    // const soundCheck = {
    //   artistId: this.artistToEdit.id,
    //   dayId,
    //   venueId,
    //   start: soundCheckStart,
    //   end: soundCheckEnd
    // };
    // const show = {
    //   artistId: this.artistToEdit.id,
    //   dayId,
    //   venueId,
    //   start: showTimeStart,
    //   end: showTimeEnd
    // };

// getIn : {
//   artistId: this.artistToEdit.id,
//   dayId,
//   venueId,
//   start: getInStart != null || undefined ? new Date(getInStart) : null,
//   end: getInEnd != null || undefined ? new Date(getInEnd) : null
// },
// setUpWings : {
//   artistId: this.artistToEdit.id,
//   dayId,
//   venueId,
//   start: setupStart != null || undefined ? new Date(setupStart) : null,
//   end: setupEnd != null || undefined ? new Date(setupEnd) : null
// },
// soundCheck : {
//   artistId: this.artistToEdit.id,
//   dayId,
//   venueId,
//   start: soundCheckStart != null || undefined ? new Date(soundCheckStart) : null,
//   end: soundCheckEnd != null || undefined ? new Date(soundCheckEnd) : null
// },
// show : {
//   artistId: this.artistToEdit.id,
//   dayId,
//   venueId,
//   start: showTimeStart != null || undefined ? new Date(showTimeStart) : null,
//   end: showTimeEnd != null || undefined ? new Date(showTimeEnd) : null
// }
// };

// const model: Artist = {
//   name,
//   photoUrl,
//   hotel: null,
//   contactName,
//   contactEmail,
//   contactPhone,
//   onRoad,
//   onStage,
//   venueId,
//   dayId,
//   getIn,
//   setUpWings,
//   soundCheck,
//   show
// };
