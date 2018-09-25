import { Component, OnInit, Inject, AfterViewInit, DoCheck } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/admin/users/service/user.service';
import { ArtistsService } from '../../artists/service/artists.service';
import { Runner } from 'src/app/_models/runner';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { GeoService } from 'src/app/_services/geo.service';
import * as firebase from 'firebase';
import { TasksService } from '../../../_services/tasks.service';
import { Place } from '../../../_models/place';

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

  locations;
  locationsList;

  directionsObs;
  estimatedDuration;
  taskDistance;


  newLocation: Place = {id: 0, name: 'New Location'};

  marsatacLat = 43.270584762037416;
  marsatacLng = 5.39729277752383;

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

    this.locations = this.geo.getLocations();
    this.geo.getLocations().subscribe(locs => {
      console.log('this.locations from geo: ', locs);

      return this.locationsList = locs;
    });

    // this.geo.getLocations().subscribe(locs => {
    //   this.locationsList = locs;
    //   console.log('this.locationsList: ', this.locationsList);
    //   this.locationsBSubject.next(this.locationsList);
    // });

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
      long: ['', [Validators.nullValidator]],
      place_id: ['', [Validators.nullValidator]]
    });
  }

  registerNewLocation() {
    console.log('this.locationsList from registerNewLocation: ', this.locationsList);
    console.log('this.registerNewLocationForm: ', this.registerNewLocationForm.value);
    console.log('this.newLocationLat: ', this.newLocationLat);
    const form = this.registerNewLocationForm.value;
    console.log('last location id: ', this.locationsList[this.locationsList.length - 1]['id']);
    const id = this.locationsList[this.locationsList.length - 1]['id'] + 1;
    const name = form.name;
    const address = form.address;
    const lat = form.lat;
    const lng = form.long;
    const place_id = form.place_id;
    const newLocation = {
      name,
      address,
      coord: new firebase.firestore.GeoPoint(lat, lng),
      place_id
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
      const place_id = this.geoCode !== undefined ? this.geoCode.results[0].place_id : '';
      this.newLocationLatSubject.next(lat);
      this.registerNewLocationForm.get('lat').setValue(lat);
      this.newLocationLngSubject.next(lng);
      this.registerNewLocationForm.get('long').setValue(lng);
      this.registerNewLocationForm.get('place_id').setValue(place_id);
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
    let type;
    console.log('form.from', form.from);
    if (form.from.name === 'Marsatac') {
      type = 'drop off';
    } else if ( form.to.name === 'Marsatac') {
      type = 'pick-up';
    } else if ( form.from.name && form.to.name !== 'Marsatac') {
      type = 'three-legs';
    }
    const marsatac = this.locationsList.find(loc => loc.name === 'Marsatac');
    console.log('form.time:', form.time);
    const departureAt = form.time !== '' ? new Date(form.time).getTime() : new Date(Date.now()).getTime();
    console.log('departureAt: ', departureAt);


    if (form.from.name === 'Marsatac') {
      this.directionsObs = this.geo.getDirections(
        {
          origin: 'ChIJbW8XYqi4yRIRHeukMHYw9ig',
          destination: 'ChIJbW8XYqi4yRIRHeukMHYw9ig',
          waypoints: [
            {
              location: form.to.place_id,
            }],
          provideRouteAlternatives: false,
          travelMode: 'DRIVING',
          drivingOptions: {
            departureTime: +departureAt,
            trafficModel: 'pessimistic'
          }
        });

    }
    this.directionsObs.subscribe(res => {
      console.log('response from api call: ', res);
      let duration = 0;
      let distance = 0;
      res.routes[0].legs.forEach(leg => {
        duration += leg.duration.value;
      });
      res.routes[0].legs.forEach(leg => {
        distance += leg.distance.value;
      });
      this.estimatedDuration = Math.round((duration + 600) / 50 ) * 50;
      this.taskDistance = distance;
      console.log('taskDuration: ', this.estimatedDuration);
      console.log('taskDistance: ', this.taskDistance);

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
        taskStatus: 'scheduled',
        estimatedDuration: this.estimatedDuration,
        distance: this.taskDistance
      };
      this.tasksService.runnersTasksCollection.add(task)
        .then(_ => {
          console.log('task created');
          this.showRegisterSuccess();
         })
        .catch(error => {
          console.log(error);
          this.showRegisterError(error);
        });
    });

    }


    showRegisterSuccess() {
      this.toastr.success('You\'ve susccesfully registered a new task');
    }

    showRegisterError(error) {
      this.toastr.error(error);
    }

  }

