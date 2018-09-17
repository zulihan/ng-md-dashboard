import { Component, OnInit, Inject, AfterViewInit, DoCheck } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/admin/users/service/user.service';
import { Location } from 'src/app/_models/Location';
import { ArtistsService } from '../../artists/service/artists.service';
import { Runner } from 'src/app/_models/runner';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { GeoService } from 'src/app/_services/geo.service';
import * as firebase from 'firebase';
import { TasksService } from '../../../_services/tasks.service';

@Component({
  selector: 'app-tasks-register',
  templateUrl: './tasks-register.component.html',
  styleUrls: ['./tasks-register.component.scss']
})
export class TasksRegisterComponent implements OnInit {

  registerTaskForm: FormGroup;
  registerNewLocationForm: FormGroup;

  persons = [1, 2, 3, 4, 5, 6, 7, 8];
  runners;
  artists;
  locations: Location[];
  // locations: Location[] =  ( [
  //   {id: 1, name: 'Festival'},
  //   {id: 2, name: 'Aéroport de Marseille'},
  //   {id: 3, name: 'Aéroport de Nice'},
  //   {id: 4, name: 'Aéroport de Montpellier'},
  //   {id: 5, name: 'Gare Saint-Charles'},
  //   {id: 6, name: 'Aéroport de Montpellier'},
  //   {id: 7, name: 'Hotel Ibis Prado'},
  //   {id: 8, name: 'Hotel Novotel Prado'},
  //   {id: 9, name: 'Hotel B&B Prado'},
  //   {id: 9, name: 'Hotel Mercure Prado'}
  // ]);

  newLocation: Location = {id: 0, name: 'New Location'};

  geoCode;
  newLocationLat;
  newLocationLong;
  lat;

  newLocationLatSubject = new Subject();
  newLocationLatObs = this.newLocationLatSubject.asObservable();
  newLocationLngSubject = new Subject();
  newLocationLngObs = this.newLocationLngSubject.asObservable();
  // newLocationLong = this.geoCode !== undefined ? this.geoCode.results[0].geometry.location.lng : '';

  // selectedValueForFromSubject  = new Subject<any>();
  // getselectedValueForFromObs = this.selectedValueForFromSubject.asObservable();
  // selectedValueForFromSub;
  // selectedValueForFrom;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private artistsService: ArtistsService,
    private geo: GeoService,
    private tasksService: TasksService,
    public taskDialogRef: MatDialogRef<TasksRegisterComponent>,
    private toastr: ToastrService) { }

  ngOnInit() {
    console.log('registerTaskForm before creation: ', this.registerTaskForm);
    this.runners = this.userService.getRunners();
    this.artists = this.artistsService.getArtistsNames();
    this.geo.getLocations().subscribe( locations => {
      console.log('locations: ', locations);
      return this.locations = locations;
    });
    this.createRegisterTaskForm();
    this.createRegisterNewLocationForm();
    this.newLocationLatObs.subscribe( res => this.newLocationLat = res);
    this.newLocationLngObs.subscribe( res => this.newLocationLong = res);
  }

  get selectedValueForFrom(): any { return this.registerTaskForm.get('from').value.name; }
  get newLocationAddress(): any { return this.registerNewLocationForm.get('address').value; }

  onNoClick(): void {
    this.taskDialogRef.close();
  }

  createRegisterTaskForm() {
    this.registerTaskForm = this.fb.group({
      runner: ['', [Validators.nullValidator]],
      artist: ['', [Validators.nullValidator]],
      persons: ['', [Validators.nullValidator]],
      from: ['', [Validators.nullValidator]],
      to: ['', [Validators.nullValidator]],
      time: ['', [Validators.nullValidator]],
      status: ['scheduled', [Validators.nullValidator]]
    });
  }

  createRegisterNewLocationForm() {
    this.registerNewLocationForm = this.fb.group({
      name : ['', [Validators.required, Validators.minLength(2)]],
      address: ['', [Validators.required, Validators.minLength(2)]],
      lat: ['', [Validators.nullValidator]],
      long: ['', [Validators.nullValidator]]
    });
  }

  registerNewLocation() {
    console.log('this.registerNewLocationForm: ', this.registerNewLocationForm.value);
    console.log('this.newLocationLat: ', this.newLocationLat);
    const form = this.registerNewLocationForm.value;
    console.log('last location id: ', this.locations[this.locations.length - 1]['id']);
    const id = this.locations[this.locations.length - 1]['id'] + 1;
    const name = form.name;
    const address = form.address;
    const lat = form.lat;
    const lng = form.long;
    const newLocation = {
      name,
      address,
      coord: new firebase.firestore.GeoPoint(lat, lng)
    };
    console.log('id: ', id);
    this.geo.setLocation(id, newLocation);
    this.registerTaskForm.get('from').setValue(newLocation);
    // this.locations.push(newLocation);
    console.log('newLocation ', newLocation);
  }

  getGeocode() {
    this.geo.getGeoCode(this.newLocationAddress)
      .subscribe( res => {
      console.log(typeof(res), res);
      this.geoCode = res;
      console.log('geoCode: ', this.geoCode);
      const lat = this.geoCode !== undefined ? this.geoCode.results[0].geometry.location.lat : '';
      const lng = this.geoCode !== undefined ? this.geoCode.results[0].geometry.location.lng : '';
      this.newLocationLatSubject.next(lat);
      this.registerNewLocationForm.get('lat').setValue(lat);
      this.newLocationLngSubject.next(lng);
      this.registerNewLocationForm.get('long').setValue(lng);
      console.log('lat ', lat);
      console.log('this.newLocationLat ', this.newLocationLat);

      });
  }

  onSubmit() {
    console.log('task register form value: ',  this.registerTaskForm.value);
    console.log('selectedValueForFrom: ', this.selectedValueForFrom);
    console.log('valueForFrom: ', this.registerTaskForm.get('from').value.name);
    const form = this.registerTaskForm.value;
    const creator = JSON.parse(localStorage.getItem('user')).userName;
    const type = form.from === 'Marsatac' ? 'drop off' : 'pick-up';
    const task = {
      createdAt: new Date(Date.now()).toString(),
      updatedAt: new Date(Date.now()).toString(),
      createdBy: creator,
      isDone: false,
      status: 'has not started yet',
      runner: form.runner,
      artist: form.artist,
      pers: form.persons,
      from: form.from,
      to: form.to,
      startAt: form.time,
      startAtToString: '',
      closedAt: null,
      over: false,
      type,
      taskStatus: 'scheduled'
    };
    this.tasksService.addRunerTask(task);
  }

  showRegisterSuccess(name) {
    this.toastr.success('You\'ve susccesfully registered a new task');
  }

  showRegisterError(error) {
    this.toastr.error(error);
  }

}
