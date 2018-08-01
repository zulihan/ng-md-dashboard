import { Injectable } from '@angular/core';
import { Artist } from 'src/app/_models/artist';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ArtistsService {

  artists: any;

constructor(private http: HttpClient) { }

  getArtists() {
    return this.http.get('http://localhost:5000/api/artists');
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
