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
    // console.log(' ArtistEditComponent -> ngOnInit -> his.data.dataKey', his.data.dataKey);
    this.artistSubscription = this.artistsService.afterEditArtist.subscribe(artist => this.artistToEdit = artist);
    this.createEditForm();
    this.artistsService.getVenues().subscribe(venues => this.venues = venues);
    console.log(' ArtistEditComponent -> ngOnInit -> this.artistToEdit', this.artistToEdit);
    console.log(' ArtistEditComponent -> ngOnInit -> this.editForm', this.editForm);
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
    console.log(' ArtistEditComponent -> onSubmit -> formValue', formValue);
    const timezoneOffset = new Date().getTimezoneOffset() * 60000;
    console.log(' ArtistEditComponent -> onSubmit -> timezoneOffset', timezoneOffset);
    const getInTest = new Date(formValue.getInStart - timezoneOffset).toISOString().slice(0, -1);
    console.log(' ArtistEditComponent -> onSubmit -> typeof(getInTest)', typeof(getInTest));
    const name = formValue.name;
    const photoUrl = formValue.photoUrl;
    const contactName = formValue.contactName;
    const contactEmail = formValue.contactEmail;
    const contactPhone = formValue.contactPhone;
    const onRoad = formValue.onRoad;
    const onStage = formValue.onStage;
    const venue = formValue.venue.name;
    const venueId = formValue.venue;
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
    console.log(' ArtistEditComponent -> onSubmit -> model', model);
    console.log(' ArtistEditComponent -> onSubmit -> model.show.start', model.show.start);
    console.log(' ArtistEditComponent -> onSubmit -> model.show.end', model.show.end);
    console.log(' ArtistEditComponent -> onSubmit -> typeof(getInStart)', typeof(getInStart));
    console.log(' ArtistEditComponent -> onSubmit -> model.getIn.end', model.getIn.end);

    this.artistsService.editArtist(this.artistToEdit.id, model)
      .subscribe( (response) => {
        console.log(' ArtistEditComponent -> onSubmit -> response', response);
        this.artistsService.updateArtistAfterEdit(this.artistToEdit.id, model);
        this.showEditSuccess(model.name.toUpperCase());
      }, error => {
        console.log(' ArtistEditComponent -> onSubmit -> error', error);
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
