import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Artist } from '../../../_models/artist';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operator/map';

@Injectable({
  providedIn: 'root'
})
export class ArtistsService {
  artistsCollection: AngularFirestoreCollection<Artist> = this.afs.collection<Artist>('artists');
  artistDocument: AngularFirestoreDocument<Artist>;

  artists: Observable<Artist[]>;

  constructor(private afs: AngularFirestore) { }

  getArtists(): Observable<Artist[]> {
    return this.artists = this.artistsCollection.valueChanges();
  }

  // getArtists() {
  //   this.artists = this.artistsCollection.snapshotChanges().map(actions => {
  //     return actions.map(a => {
  //       const data = a.payload.doc.data() as Artist;
  //       data.id = a.payload.doc.id;
  //       return data;
  //     });
  //   });
  //     return this.artists;
  // }


}
