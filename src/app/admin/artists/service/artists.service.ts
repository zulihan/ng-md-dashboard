import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

import { Artist } from '../../../_models/artist';



@Injectable({
  providedIn: 'root'
})
export class ArtistsService {

  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getArtists(): Observable<Artist[]> {
    return this.http.get<Artist[]>(this.baseUrl + 'artists');
  }

  getArtist(id): Observable<Artist> {
    return this.http.get<Artist>(this.baseUrl + 'artists/' + id);
  }


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
