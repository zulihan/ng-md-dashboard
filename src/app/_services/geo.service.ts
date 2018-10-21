import { Injectable, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import * as Geofire from 'geofire';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { Place } from 'src/app/_models/place';


@Injectable()
export class GeoService implements OnInit {

  locationsCollection: AngularFirestoreCollection<Place>;

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

   getRunners() {
     return this.http.get(this.nodeApi + 'runners/');
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
