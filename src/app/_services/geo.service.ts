import { Injectable, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import * as Geofire from 'geofire';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { Place } from 'src/app/_models/place';
import { RunnerTracking } from 'src/app/_models/runner-tracking';


@Injectable()
export class GeoService implements OnInit {

  locationsCollection: AngularFirestoreCollection<Place>;
  runnersLocationsCollection: AngularFirestoreCollection<RunnerTracking>;

  locationsList;
  locationsBSubject = new BehaviorSubject<Place[]>(this.locationsList);
  locations;

  dbRef: any;
  geoFire: any;

  hits = new BehaviorSubject([]);

  googleGeocodeUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address=';

  apiKey = environment.googleMapsKey;
  fsApiKey = environment.firebaseConfig.apiKey;
  nodeApi = environment.nodeApiUrl;

  constructor(private afs: AngularFirestore, private http: HttpClient) {
    this.locationsCollection = this.afs.collection<Place>('locations');
    this.runnersLocationsCollection = this.afs.collection<RunnerTracking>('runners');
  }

   ngOnInit() {
    this.locationsBSubject.next(this.locationsList);
   }

   getLocations() {
    this.locations = this.locationsCollection.snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Place;
        const id = +a.payload.doc.id;
        return { id, ...data };
      });
    });
    return this.locations;
   }

   getGeoCode(address) {
     return this.http.get(this.googleGeocodeUrl + address + '&key=' + this.apiKey);
   }

   // Adds GeoFire data to database
   setLocation(id: number, location: Place) {
     this.afs.collection<Place>('locations').doc(id.toString()).set(location)
         .then(_ => console.log('location updated'))
         .catch(err => console.log(err));
   }

   getEstimatedTravelTime(locatinOne: any, locationTwo: any, departure: any) {
    return this.http.get('https://maps.googleapis.com/maps/api/directions/json?origin='
            + locatinOne.coord.latitude + ',' + locatinOne.coord.longitude +
            '&destination='
            + locationTwo.coord.latitude + ',' + locationTwo.coord.longitude +
            '&departure_time=' + departure +
            '&mode=driving' +
            '&key='
            + this.apiKey);
   }

  getDirections(object) {
    console.log('object in getDistance(): ', object);
    console.log('$$$$$$$$$$$$ GeoService -> getDirections -> object.waypoints.length', object.waypoints.length);

    if (object.waypoints.length > 1) {
      let waypoints = 'place_id:' + object.waypoints[0].location + '|' +
      'place_id:' + object.waypoints[1].location
      
      return this.http.get(this.nodeApi +
        'directions/place_id:' +
        object.origin +
        '/place_id:' +
        object.destination +
        '/' +
        waypoints +
        '/' +
        object.drivingOptions.departureTime +
        '/' +
        object.travelMode +
        '/' +
        object.drivingOptions.trafficModel
      )
    }
    return this.http.get(this.nodeApi +
    'directions/place_id:' +
    object.origin +
    '/place_id:' +
    object.destination +
    '/place_id:' +
    object.waypoints[0].location +
    '/' +
    object.drivingOptions.departureTime +
    '/' +
    object.travelMode +
    '/' +
    object.drivingOptions.trafficModel
    );
    //  .pipe(map(response => console.log(response)))
   }

  getRunnersLocations(): Observable<any> {
    return this.runnersLocationsCollection.snapshotChanges().map(actions => {
      return actions.map(action => {
        const data = action.payload.doc.data() as RunnerTracking;
        const id = action.payload.doc.id;
        return { id, ...data };
      });
    });
  }

  getRunnerLocation(runnerId): Observable<any> {
    console.log(' GeoService -> runnerId', runnerId);
    let runnerLocationDoc = this.afs.collection('runners', ref => ref.where('uid','==', runnerId));
    console.log(' GeoService -> runnerLocationDoc', runnerLocationDoc);
    let runnerLocation = runnerLocationDoc.valueChanges();
    console.log(' GeoService -> runnerLocation', runnerLocation);
    return runnerLocation;
  }


   /// Queries database for nearby locations
   /// Maps results to the hits BehaviorSubject
  //  getLocations(radius: number, coords: Array<number>) {
  //   this.geoFire.query({
  //     center: coords,
  //     radius: radius
  //   })
  //   .on('key_entered', (key, location, distance) => {
  //     const hit = {
  //       location: location,
  //       distance: distance
  //     };

  //     const currentHits = this.hits.value;
  //     currentHits.push(hit);
  //     this.hits.next(currentHits);
  //   })
  //  }
}
