import { Injectable, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Location } from '../_models/Location';
import { Task } from 'src/app/_models/task';



@Injectable()
export class GeoService implements OnInit {

  locationsCollection: AngularFirestoreCollection<Location>;
  locations: Observable<Location[]>;

  dbRef: any;
  geoFire: any;

  hits = new BehaviorSubject([]);

  googleGeocodeUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
  apiKey = 'AIzaSyAjUVpulfQoIt0LHVGcO9KLzitRXwbZVfs';

  constructor(private afs: AngularFirestore, private http: HttpClient) {
    this.locationsCollection = this.afs.collection<Location>('locations');
    this.locations = this.locationsCollection.snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Location;
        const id = +a.payload.doc.id;
        return { id, ...data };
      });
    });
  }

   ngOnInit() {

   }

   getLocations() {
    console.log(this.locations);
    return this.locations;
   }

   getGeoCode(address) {
     return this.http.get(this.googleGeocodeUrl + address + '&key=' + this.apiKey);
   }

   // Adds GeoFire data to database
   setLocation(id: number, location: Location) {
     this.afs.collection<Location>('locations').doc(id.toString()).set(location)
         .then(_ => console.log('location updated'))
         .catch(err => console.log(err));
   }

   setNewTask() {

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
