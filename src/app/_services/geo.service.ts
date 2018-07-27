import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
// AngularFirestoreDocument
// import { FirebaseApp } from 'angularfire2';

// import * as GeoFire from 'geofire';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Location } from '../_models/Location';



@Injectable()
export class GeoService {

  locationsCollection: AngularFirestoreCollection<Location>;
  locations: Observable<Location[]>;

  dbRef: any;
  geoFire: any;

  hits = new BehaviorSubject([]);

  constructor(private afs: AngularFirestore) {
    ///
    this.locationsCollection = this.afs.collection<Location>('locations');
    this.locations = this.locationsCollection.valueChanges();
   }

   getLocations() {
     // console.log(this.locations);
      return this.locations;
   }

   /// Adds GeoFire data to database
  //  setLocation(key: string, coords: Array<number>) {
  //    this.geoFire.set(key, coords)
  //        .then(_ => console.log('location updated'))
  //        .catch(err => console.log(err));
  //  }


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
