import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, BehaviorSubject } from 'rxjs';

import { environment } from '../../../../environments/environment';

import { Artist } from '../../../_models/artist';
import { Venue } from '../../../_models/venue';
import { Checklist } from '../../../_models/checklist';


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
    console.log(' ArtistsService -> updateArtistAfterEdit -> artist', artist);
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
    console.log(' ArtistsService -> updateArtistAfterEdit -> artist after edit', artist);
    this.artistDetails.next(artist);
    const findInArtistList = this.artistList.find( el => el.id === artistId);
    console.log(' ArtistsService -> updateArtistAfterEdit -> findInArtistList', findInArtistList);
    const indexInArtistList = this.artistList.indexOf(findInArtistList);
    console.log(' ArtistsService -> updateArtistAfterEdit -> indexInArtistList', indexInArtistList);
    this.artistList.splice(indexInArtistList, 1);
    this.artistList.splice(indexInArtistList, 0, artist);
    this.artistListSubject.next(this.artistList);
  }

  artistIsAlreadyInList(artist) {
    const artistInList =  this.artistList.find( el => {
      return el.id === artist.id;
    });
    return artistInList !== undefined ? true :  false;
  }

  registerArtist(model: Artist): Observable<Artist> {
    console.log(' ArtistsService -> constructor -> model', model);
    return this.http.post<Artist>(this.baseUrl + 'artists/register', model);
  }

  getArtists(): Observable<Artist[]> {
    const artistsFromDb = this.http.get<Artist[]>(this.baseUrl + 'artists');
    artistsFromDb.subscribe( artists => {
      console.log(' ArtistsService -> getArtists() -> artists', artists);
      artists.map((artist) => {
        if (!this.artistIsAlreadyInList(artist)) {
          this.artistList.push(artist);
        }
      });
      console.log(' ArtistsService -> getArtists() -> this.artistList', this.artistList);
      // this.artistList = [];
      this.artistListSubject.next(this.artistList);
    });
    return artistsFromDb;
  }

  getArtistsNames(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl + 'artists/names');
  }

  getArtistsByDay(dayNumber: number) {
    return this.http.get<Artist[]>(this.baseUrl + 'artists/day/' + dayNumber);
  }

  getArtistsByDayByVenue(dayNumber: number, venueId: number) {
    return this.http.get<Artist[]>(this.baseUrl + 'artists/day/' + dayNumber + '/venue/' + venueId);
  }

  getArtist(id: number): Observable<Artist> {
    const artistFromDB = this.http.get<Artist>(this.baseUrl + 'artists/' + id);
    artistFromDB.subscribe(a => {
      console.log(' ArtistsService -> constructor -> artistFromDB', a);
      this.updateArtistAfterEdit(a.id, a);
    });
    return artistFromDB;
  }

  editArtist(id: number, artist: any): Observable<Artist> {
    this.editedArtist = artist;
    return this.http.put<Artist>(this.baseUrl + 'artists/' + id, artist);
  }

  deleteArtist(id: number, name): Observable<any> {
    const indexInArtistList = this.artistList.map( el => el.id).indexOf(id);
    this.artistList.splice(indexInArtistList, 1);
    console.log(' ArtistsService -> constructor -> indexInArtistList', indexInArtistList);
    this.artistListSubject.next(this.artistList);
    return this.http.delete(this.baseUrl + 'artists/delete/' + id);
  }

  getChecklists(): Observable<Checklist[]> {
    return this.http.get<Checklist[]>(this.baseUrl + 'artists/checklists');
  }

  getArtistChecklist(id: number): Observable<Checklist> {
    return this.http.get<Checklist>(this.baseUrl + 'artists/' + id + '/checklist');
  }

  updateArtistChecklist(id: number, checklist: Checklist): Observable<Checklist> {
    return this.http.put<Checklist>(this.baseUrl + 'artists/checklist/' + id, checklist);
  }

  getVenues(): Observable<Venue[]> {
    return this.http.get<Venue[]>(this.baseUrl + 'venues');
  }

}
