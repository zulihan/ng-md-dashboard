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
import { RunzService } from '../../../_services/runz.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { TaskStatus, RunStatus, RunType } from "src/app/_enums/enums";
import { environment } from 'src/environments/environment'


@Component({
  selector: 'app-tasks-register',
  templateUrl: './tasks-register.component.html',
  styleUrls: ['./tasks-register.component.scss']
})
export class TasksRegisterComponent implements OnInit {
  // TODO: Create a new component for the newLocation form

  FESTIVAL = environment.FESTIVAL;
  festival = {
    name: this.FESTIVAL.NAME,
    place_id: this.FESTIVAL.PLACE_ID,
    Coord: {
      latitude: this.FESTIVAL.LAT,
      longitude: this.FESTIVAL.LNG
    }
  }

  registerTaskForm: FormGroup;
  registerNewLocationForm: FormGroup;

  persons = [1, 2, 3, 4, 5, 6, 7, 8];
  runners;
  artists;

  task;
  run;
  type;
  legs;
  directionsLegs;

  locations;
  locationsList;

  directionsObs: Observable<Object>;
  estimatedDuration;
  taskDistance;

  newLocation: Place = {id: 0, name: 'New Location'};
 
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
    private runzService: RunzService,
    public taskDialogRef: MatDialogRef<TasksRegisterComponent>,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService) { }

  ngOnInit() {
    console.log(' TasksRegisterComponent -> ngOnInit -> this.registerTaskForm', this.registerTaskForm);
    this.runners = this.userService.getRunners();
    this.artists = this.artistsService.getArtistsNames();

    this.locations = this.geo.getLocations();
    this.geo.getLocations().subscribe(locs => {
      console.log(' TasksRegisterComponent -> ngOnInit -> locs', locs);
      this.locationsList = locs;
      // this.festival = this.locationsList.find(loc => loc.name === 'Marsatac');
      return this.locationsList;
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
    console.log(' TasksRegisterComponent -> registerNewLocation -> this.locationsList', this.locationsList);
    console.log(' TasksRegisterComponent -> registerNewLocation -> this.registerNewLocationForm.value', this.registerNewLocationForm.value);
    console.log(' TasksRegisterComponent -> registerNewLocation -> this.newLocationLat', this.newLocationLat);
    const form = this.registerNewLocationForm.value;
    console.log(' TasksRegisterComponent -> registerNewLocation -> this.locationsList[this.locationsList.length - 1]["id"]',
      this.locationsList[this.locationsList.length - 1]['id']);
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
    console.log(' TasksRegisterComponent -> registerNewLocation -> id', id);
    this.geo.setLocation(id, newLocation);
    this.registerTaskForm.get('from').setValue(newLocation);
    // this.locations.push(newLocation);
    console.log(' TasksRegisterComponent -> registerNewLocation -> newLocation', newLocation);
  }

  getGeocode() {
    this.geo.getGeoCode(this.newLocationAddress)
      .subscribe( res => {
        console.log(' TasksRegisterComponent -> getGeocode -> typeof(res), res', typeof(res), res);
        this.geoCode = res;
        console.log(' TasksRegisterComponent -> getGeocode -> this.geoCode', this.geoCode);
        const lat = this.geoCode !== undefined ? this.geoCode.results[0].geometry.location.lat : '';
        const lng = this.geoCode !== undefined ? this.geoCode.results[0].geometry.location.lng : '';
        const place_id = this.geoCode !== undefined ? this.geoCode.results[0].place_id : '';
        this.newLocationLatSubject.next(lat);
        this.registerNewLocationForm.get('lat').setValue(lat);
        this.newLocationLngSubject.next(lng);
        this.registerNewLocationForm.get('long').setValue(lng);
        this.registerNewLocationForm.get('place_id').setValue(place_id);
        console.log(' TasksRegisterComponent -> getGeocode -> lat', lat);
        console.log(' TasksRegisterComponent -> getGeocode -> this.newLocationLat', this.newLocationLat);
      });
  }

  onSubmit() {
    console.log('task register form value: ',  this.registerTaskForm.value);
    console.log('selectedValueForFrom: ', this.selectedValueForFrom);
    console.log('valueForFrom: ', this.registerTaskForm.get('from').value.name);
    const form = this.registerTaskForm.value;
    this.getDirections(form).subscribe( directions => {
      this.spinner.show();
      console.log(' TasksRegisterComponent -> onSubmit -> res: response from api call', directions);
      this.createLegs(form, directions);
      this.createRun(form, this.legs)
        .then( ref => {
        const runId = ref.id;
        this.createTask(form, runId)
          .then(_ => {
            console.log(' TasksRegisterComponent -> onSubmit');
            this.spinner.hide();
            this.onNoClick();
            this.showRegisterSuccess();
          })
          .catch(error => {
            console.log(' TasksRegisterComponent -> onSubmit -> error', error);
            this.showRegisterError(error);
          });
      });      
    });  
  }

  getDirections(form): Observable<Object> {
    console.log(' TasksRegisterComponent -> onSubmit -> form.time', form.time);
    const departureAt = form.time !== '' ? new Date(form.time).getTime() : new Date(Date.now()).getTime();
    console.log(' TasksRegisterComponent -> onSubmit -> departureAt', departureAt);

    if (form.from.name === this.FESTIVAL.NAME) {
      this.type = RunType.DROPOFF;
      this.directionsObs = this.geo.getDirections(
        {
          origin: this.FESTIVAL.PLACE_ID,
          destination: this.FESTIVAL.PLACE_ID,
          waypoints: [
            {
              location: form.to.place_id,
            }
          ],
          provideRouteAlternatives: false,
          travelMode: 'DRIVING',
          drivingOptions: {
            departureTime: +departureAt,
            trafficModel: 'pessimistic'
          }
        });
    } else if (form.to.name === this.FESTIVAL.NAME ) {
      this.type = RunType.PICKUP;
      this.directionsObs = this.geo.getDirections(
        {
          origin: this.FESTIVAL.PLACE_ID,
          destination: this.FESTIVAL.PLACE_ID,
          waypoints: [
            {
              location: form.from.place_id,
              stopover: true
            }
          ],
          provideRouteAlternatives: false,
          travelMode: 'DRIVING',
          drivingOptions: {
            departureTime: +departureAt,
            trafficModel: 'pessimistic'
          }
        });
    } else if (form.from.name !== this.FESTIVAL.NAME && form.to.name !== this.FESTIVAL.NAME ) {
      this.type = RunType.THREELEGS;
      this.directionsObs = this.geo.getDirections(
        {
          origin: this.FESTIVAL.PLACE_ID,
          destination: this.FESTIVAL.PLACE_ID,
          waypoints: [
            {
              location: form.from.place_id,
              stopover: true
            },
            {
              location: form.to.place_id,
              stopover: true
            }
          ],
          provideRouteAlternatives: false,
          travelMode: 'DRIVING',
          drivingOptions: {
            departureTime: +departureAt,
            trafficModel: 'pessimistic'
          }
        });
    }
    return this.directionsObs;
  }

  createLegs(form, directions) {
    console.log(' TasksRegisterComponent -> createLegs -> directions', directions);
    this.directionsLegs = directions.routes[0].legs;
    console.log(' TasksRegisterComponent -> createLegs -> this.directionsLegs', this.directionsLegs);

    if (this.type === RunType.DROPOFF || this.type === RunType.PICKUP) {
      this.legs = {
        one: {
          started_at: '',
          completed_at: '',
          distance: this.directionsLegs[0].distance.value,
          duration: this.directionsLegs[0].duration.value,
          percent_dist_travelled: 0,
        },
        two: {
          started_at: '',
          completed_at: '',
          distance: this.directionsLegs[1].distance.value,
          duration: this.directionsLegs[1].duration.value,
          percent_dist_travelled: 0,
        }
      };
      if (this.type === RunType.DROPOFF) {
        this.legs['one'].from = form.from;
        this.legs['one'].to = form.to;
        this.legs['two'].from = form.to;
        this.legs['two'].to = form.from;
      } else if (this.type === RunType.PICKUP ) {
        this.legs['one'].from = form.to;
        this.legs['one'].to = form.from;
        this.legs['two'].from = form.from;
        this.legs['two'].to = form.to;
      }
    } else if (this.type === RunType.THREELEGS) {
      this.legs = {
        one: {
          // started_at: '',
          // completed_at: '',
          distance: this.directionsLegs[0].distance.value,
          duration: this.directionsLegs[0].duration.value,
          percent_dist_travelled: 0,
          from: this.festival,
          to: form.from
        },
        two: {
          // started_at: '',
          // completed_at: '',
          distance: this.directionsLegs[1].distance.value,
          duration: this.directionsLegs[1].duration.value,
          percent_dist_travelled: 0,
          from: form.from,
          to: form.to
        },
        three: {
          // started_at: '',
          // completed_at: '',
          distance: this.directionsLegs[2].distance.value,
          duration: this.directionsLegs[2].duration.value,
          percent_dist_travelled: 0,
          from: form.to,
          to: this.festival
        }
      };
    } else {
      console.log(' TasksRegisterComponent -> createLegs -> error: ', 'unknown type !');
    }
    return this.legs;
  }

  createRun(form, legs): Promise<firebase.firestore.DocumentReference> {
    let duration = 0;
    let distance = 0;
    let from = form.from;
    let to = form.to;
    let runner_id = form.runner.id;
    let start_scheduled_at = form.time;
    for (const key in legs) {
      if (legs.hasOwnProperty(key)) {
        distance += legs[key].distance;
        console.log(' TasksRegisterComponent -> distance', distance);
        duration += legs[key].duration;
        console.log(' TasksRegisterComponent -> duration', duration);
        console.log(' TasksRegisterComponent -> legs[key].distance', legs[key].distance);
        console.log(' TasksRegisterComponent -> legs[key].duration.value', legs[key].duration);
      }
    }

    this.estimatedDuration = Math.round((duration + 600) / 50 ) * 50;
    this.taskDistance = distance;
    console.log(' TasksRegisterComponent -> onSubmit -> this.estimatedDuration', this.estimatedDuration);
    console.log(' TasksRegisterComponent -> onSubmit -> this.taskDistance', this.taskDistance);
    this.run = {
      from,
      to,
      start_scheduled_at,
      runner_id,
      status: RunStatus.NOT_STARTED,
      // started_at: '',
      distance_travelled: 0,
      distance_total: Number(this.taskDistance),
      duration_total: Number(this.estimatedDuration),
      estimated_duration: Number(this.estimatedDuration),
      percent_dist_travelled: 0,
      legs
    };
    console.log(' TasksRegisterComponent -> this.run', this.run);
    return this.runzService.initRun(this.run);
  }

  createTask(form, runId) {
    const creator = JSON.parse(localStorage.getItem('user')).userName;
    this.task = {
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
      createdBy: creator,
      isDone: false,
      runner: form.runner,
      artist: form.artist,
      pers: form.persons,
      from: form.from,
      to: form.to,
      startAt: form.time,
      startAtToString: '',
      closedAt: '',
      over: false,
      type: this.type,
      taskStatus: TaskStatus.SCHEDULED,
      status: RunStatus.NOT_STARTED,
      estimatedDuration: this.estimatedDuration,
      runId,
      distance: this.taskDistance
    };

    return this.tasksService.runnersTasksCollection.add(this.task);
  }

  showRegisterSuccess() {
    this.toastr.success('You\'ve susccesfully registered a new task');
  }

  showRegisterError(error) {
    this.toastr.error(error);
  }

  // showLoading() {
  //   if(!this.loading){
  //     this.loading = this.loadingCtrl.create({
  //       content: 'Loading position...'
  //     });
  //       this.loading.present();
  //   }
  // }

  // dismissLoading(error?) {
  //     if (this.loading) {
  //         this.loading.dismiss();
  //         this.loading = null;
  //         if (error) {
  //           alert(error)
  //         }
  //     }
  // }

}

