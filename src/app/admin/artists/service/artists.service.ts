import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, BehaviorSubject } from 'rxjs';

import { environment } from '../../../../environments/environment';

import { Artist } from '../../../_models/artist';
import { Venue } from '../../../_models/venue';
import { map } from '../../../../../node_modules/rxjs-compat/operator/map';



@Injectable({
  providedIn: 'root'
})
export class ArtistsService {

  baseUrl = environment.apiUrl;
  artistList: Artist[] = [];
  artistListSubject = new BehaviorSubject<Artist[]>(this.artistList);
  artistListObservable = this.artistListSubject.asObservable();

  editedArtist: Artist;
  artistDetails = new BehaviorSubject<Artist>(this.editedArtist);
  afterEditArtist = this.artistDetails.asObservable();

  constructor(private http: HttpClient) { }

  updateArtistAfterEdit(artistId: number, artist: Artist) {
    artist.id = artistId;
    artist.day = artist.dayId === 4 ? 'Not set yet' : artist.dayId.toString();
    artist.venue = artist.venueId === 4 ? 'Not set yet' : artist.venueId.toString();
    artist.show.start = typeof artist.show.start === 'string' ? new Date(artist.show.start) : artist.show.start;
    artist.show.end = typeof artist.show.end === 'string' ? new Date(artist.show.end) : artist.show.end;
    artist.getIn.start =  typeof artist.getIn.start === 'string' ? new Date(artist.getIn.start) : artist.getIn.start;
    artist.getIn.end = typeof artist.getIn.end === 'string' ? new Date(artist.getIn.end) : artist.getIn.end;
    artist.setUpWings.start = typeof artist.setUpWings.start === 'string' ? new Date(artist.setUpWings.start) : artist.setUpWings.start;
    artist.setUpWings.end = typeof artist.setUpWings.end === 'string' ? new Date(artist.setUpWings.end) : artist.setUpWings.end;
    artist.soundCheck.start = typeof artist.soundCheck.start === 'string' ? new Date(artist.soundCheck.start) : artist.soundCheck.start;
    artist.soundCheck.end = typeof artist.soundCheck.end === 'string' ? new Date(artist.soundCheck.end) : artist.soundCheck.end;
    console.log('artist from updateArtistAfterEdit: ', artist);
    this.artistDetails.next(artist);
  }

  registerArtist(model: Artist): Observable<Artist> {
    console.log('model from artist service: ', model);
    return this.http.post<Artist>(this.baseUrl + 'artists/register', model);
  }

  getArtists(): Observable<Artist[]> {
    const artistsFromDb = this.http.get<Artist[]>(this.baseUrl + 'artists');
    artistsFromDb.subscribe( artists => {
      artists.map((artist) => !this.artistList.includes(artist) ? this.artistList.push(artist) : false);
      console.log('artist list: ', this.artistList);
      this.artistListSubject.next(this.artistList);
    });
    return artistsFromDb;
  }

  getArtistsByDay(dayNumber: number) {
    return this.http.get<Artist[]>(this.baseUrl + 'artists/day/' + dayNumber);
  }

  getArtist(id: number): Observable<Artist> {
    const artistFromDB = this.http.get<Artist>(this.baseUrl + 'artists/' + id);
    artistFromDB.subscribe(a => {
      console.log('artist from getArtistMethod: ', a);
      this.updateArtistAfterEdit(a.id, a);
    });
    return artistFromDB;
  }

  editArtist(id: number, artist: any): Observable<Artist> {
    this.editedArtist = artist;
    // const timezoneOffset = new Date().getTimezoneOffset() * -60000;
    // artist.getIn.start = artist.getIn.start != null || undefined ?
    //   artist.getIn.start : null;
    // artist.getIn.end = artist.getIn.end != null || undefined ?
    //   artist.getIn.end : null;
    // artist.setUpWings.start = artist.setUpWings.start != null || undefined ?
    //   artist.setUpWings.start : null;
    // artist.setUpWings.end = artist.setUpWings.end != null || undefined ?
    //   artist.setUpWings.end : null;
    // artist.soundCheck.start = artist.soundCheck.start != null || undefined ?
    //   artist.soundCheck.start : null;
    // artist.soundCheck.end = artist.soundCheck.end != null || undefined ?
    //   artist.soundCheck.end : null;
    // artist.show.start = artist.show.start != null || undefined ?
    //   artist.show.start : null;
    // artist.soundCheck.end = artist.soundCheck.end != null || undefined ?
    //   artist.soundCheck.end : null;

    return this.http.put<Artist>(this.baseUrl + 'artists/' + id, artist);
  }

  deleteArtist(id: number): Observable<any> {
    return this.http.delete(this.baseUrl + 'artists/delete/' + id);
  }

  getVenues(): Observable<Venue[]> {
    return this.http.get<Venue[]>(this.baseUrl + 'venues');
  }


  // getArtist(id: number): Observable<Artist> {
  //   const artistFromDB = this.http.get<Artist>(this.baseUrl + 'artists/' + id);
  //   let artist = artistFromDB.subscribe((a) => {
  //     console.log('a from getArtist method', a);
  //     return artist = a;
  //   });
  //   console.log('artist from getArtist method', artist);
  //   this.artistDetails.next(artist);
  //   return artistFromDB;
  // }


  // getArtists() {
  //   this.http.get('http://localhost:5000/api/artists').subscribe( response => {
  //     this.artists = response;
  //   }, error => {
  //     console.log(error);
  //   });
  //   console.log('artists from service: ', this.artists);
  //   return this.artists;
  // }

}


// artist.getIn.start = artist.getIn.start != null || undefined ?
//       artist.getIn.start : null;
//     artist.getIn.end = artist.getIn.end != null || undefined ?
//       artist.getIn.end : null;
//     artist.setUpWings.start = artist.setUpWings.start != null || undefined ?
//       artist.setUpWings.start : null;
//     artist.setUpWings.end = artist.setUpWings.end != null || undefined ?
//       artist.setUpWings.end : null;
//     artist.soundCheck.start = artist.soundCheck.start != null || undefined ?
//       artist.soundCheck.start : null;
//     artist.soundCheck.end = artist.soundCheck.end != null || undefined ?
//       artist.soundCheck.end : null;
//     artist.show.start = artist.show.start != null || undefined ?
//       artist.show.start : null;
//     artist.soundCheck.end = artist.soundCheck.end != null || undefined ?
//       artist.soundCheck.end : null;

// editArtist(id: number, artist: Artist): Observable<Artist> {
//   this.editedArtist = artist;
//   const timezoneOffset = new Date().getTimezoneOffset() * -60000;
//   artist.getIn.start = artist.getIn.start != null || undefined ?
//     new Date(artist.getIn.start.getTime() + timezoneOffset) : null;
//   artist.getIn.end = artist.getIn.end != null || undefined ?
//     new Date(artist.getIn.end.getTime() + timezoneOffset) : null;
//   artist.setUpWings.start = artist.setUpWings.start != null || undefined ?
//     new Date(artist.setUpWings.start.getTime() + timezoneOffset) : null;
//   artist.setUpWings.end = artist.setUpWings.end != null || undefined ?
//     new Date(artist.setUpWings.end.getTime() + timezoneOffset) : null;
//   artist.soundCheck.start = artist.soundCheck.start != null || undefined ?
//     new Date(artist.soundCheck.start.getTime() + timezoneOffset) : null;
//   artist.soundCheck.end = artist.soundCheck.end != null || undefined ?
//     new Date(artist.soundCheck.end.getTime() + timezoneOffset) : null;
//   artist.show.start = artist.show.start != null || undefined ?
//     new Date(artist.show.start.getTime() + timezoneOffset) : null;
//   artist.soundCheck.end = artist.soundCheck.end != null || undefined ?
//     new Date(artist.soundCheck.end.getTime() + timezoneOffset) : null;

//   return this.http.put<Artist>(this.baseUrl + 'artists/' + id, artist);
// }

