import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { RunnerTask } from 'src/app/_models/runner-task';
import { TasksService } from '../../../_services/tasks.service';
import { Location } from 'src/app/_models/Location';
import { Subject } from 'rxjs';
import { UserService } from 'src/app/admin/users/service/user.service';
import { GeoService } from 'src/app/_services/geo.service';
import { ArtistsService } from 'src/app/admin/artists/service/artists.service';
import * as firebase from 'firebase';
import { Place } from 'src/app/_models/place';


@Component({
  selector: 'app-task-edit',
  templateUrl: './task-edit.component.html',
  styleUrls: ['./task-edit.component.scss']
})
export class TaskEditComponent implements OnInit, AfterViewInit {

  runnerTaskToEdit: RunnerTask;
  editTaskForm: FormGroup;
  registerNewLocationForm: FormGroup;

  persons = [1, 2, 3, 4, 5, 6, 7, 8];
  runners;
  runnersList;
  artists;
  artistsList;
  locations: Place[];

  newLocation: Place = {id: 0, name: 'New Location'};

  geoCode;
  newLocationLat;
  newLocationLong;
  lat;

  newLocationLatSubject = new Subject();
  newLocationLatObs = this.newLocationLatSubject.asObservable();
  newLocationLngSubject = new Subject();
  newLocationLngObs = this.newLocationLngSubject.asObservable();

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private artistsService: ArtistsService,
    private geo: GeoService,
    private tasksService: TasksService,
    private toastr: ToastrService,
    public taskDialogRef: MatDialogRef<TaskEditComponent>,
    public dialogRef: MatDialogRef<TaskEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

  ngOnInit() {
    console.log(this.data.dataKey);
    this.runnerTaskToEdit = this.data.dataKey;
    console.log('this.runnerTaskToEdit ', this.runnerTaskToEdit);
    this.runners = this.userService.getRunners();
    this.artists = this.artistsService.getArtistsNames();
    this.geo.getLocations().subscribe( locations => {
      console.log('locations: ', locations);
      return this.locations = locations;
    });
    this.createEditForm();
    // this.editTaskForm.get('runner').setValue(this.runnerTaskToEdit.runner.userName);
    this.createRegisterNewLocationForm();
    this.newLocationLatObs.subscribe( res => this.newLocationLat = res);
    this.newLocationLngObs.subscribe( res => this.newLocationLong = res);

  }

  ngAfterViewInit() {
    this.runners.subscribe(rs => {
      return this.runnersList = rs;
    });
    this.artists.subscribe(as => {
      return this.artistsList = as;
    });
  }

  get selectedValueForFrom(): any { return this.editTaskForm.get('from').value.name; }
  get newLocationAddress(): any { return this.editTaskForm.get('address').value; }

  onNoClick(): void {
    this.taskDialogRef.close();
  }

  // createEditForm() {
  //   this.editTaskForm = this.fb.group({
  //     runner: [this.runnerTaskToEdit.runner.userName, [Validators.nullValidator]],
  //     artist: [this.runnerTaskToEdit.artist, [Validators.nullValidator]],
  //     persons: [this.runnerTaskToEdit.pers, [Validators.nullValidator]],
  //     from: [this.runnerTaskToEdit.from, [Validators.nullValidator]],
  //     to: [this.runnerTaskToEdit.to, [Validators.nullValidator]],
  //     time: [this.runnerTaskToEdit.startAtToString, [Validators.nullValidator]],
  //     status: [this.runnerTaskToEdit.status, [Validators.nullValidator]],
  //     taskStatus: [this.runnerTaskToEdit.taskStatus, [Validators.nullValidator]]
  //   });
  // }

  createEditForm() {
    this.editTaskForm = this.fb.group({
      runner: [this.runnerTaskToEdit.runner.userName, [Validators.nullValidator]],
      artist: [this.runnerTaskToEdit.artist.name, [Validators.nullValidator]],
      persons: [this.runnerTaskToEdit.pers, [Validators.nullValidator]],
      from: [this.runnerTaskToEdit.from.name, [Validators.nullValidator]],
      to: [this.runnerTaskToEdit.to.name, [Validators.nullValidator]],
      time: [new Date(this.runnerTaskToEdit.startAt), [Validators.nullValidator]],
      status: [this.runnerTaskToEdit.status, [Validators.nullValidator]],
      taskStatus: ['scheduled', [Validators.nullValidator]]
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
    this.editTaskForm.get('from').setValue(newLocation);
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
    const form = this.editTaskForm.value;
    console.log('form value: ', form);
    const runner = this.runnersList.find( runners => runners.userName === form.runner);
    console.log('runner: ', runner);

    const artist  =  this.artistsList.find( artists => artists.name === form.artist);
    console.log('artist: ', artist);

    const from = this.locations.find(loc => loc.name === form.from);
    console.log('from: ', from);

    const to = this.locations.find(loc => loc.name === form.to);
    console.log('from: ', to);

    const time = form.time;
    console.log('time: ', time);
    //   this.runnersList = rs;
    //   return this.runnersList.find( runners => runners.userName === form.runner);
    // });




    // const runner = this.runners.find( run => run.userName === form.runner);
    // console.log('runner : ', runner);
    // const creator = this.runnerTaskToEdit.createdBy;
    // const type = form.from === 'Marsatac' ? 'drop off' : 'pick-up';
    // const createdAt = this.runnerTaskToEdit.createdAt;
    // const startAtToString = new Date(form.startAt).toString();
    // const taskId = this.runnerTaskToEdit.id;
    // const task = {
    //   createdAt: createdAt,
    //   updatedAt: new Date(Date.now()).toString(),
    //   createdBy: creator,
    //   isDone: false,
    //   status: form.status,
    //   runner: form.runner,
    //   artist: form.artist,
    //   pers: form.persons,
    //   from: form.from,
    //   to: form.to,
    //   startAt: form.time,
    //   startAtToString: startAtToString,
    //   closedAt: null,
    //   over: this.runnerTaskToEdit.over,
    //   type,
    //   taskStatus: form.taskStatus
    // };
    // this.tasksService.updateRunnerTask(taskId, task);
  }

  showEditSuccess() {
    this.toastr.success('You\'ve susccesfully edited the task');
  }

  showEditError(error) {
    this.toastr.error(error);
  }

}
