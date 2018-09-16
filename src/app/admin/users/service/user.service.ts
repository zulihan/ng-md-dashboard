import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { User } from '../../../_models/User';
import { Runner } from 'src/app/_models/runner';




@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl +  'users');
  }

  getUser(id): Observable<User> {
    return this.http.get<User>(this.baseUrl +  'users/' + id);
  }

  getRunners(): Observable<Runner[]> {
    return this.http.get<Runner[]>(this.baseUrl + 'users/runners');
  }

  updateUser(id: number, user: User): Observable<User> {
    console.log('user to send to edit: ', user);
    return this.http.put<User>(this.baseUrl + 'users/update/' + id, user);
  }

  deletePhoto(userId: number, id: number) {
    return this.http.delete(this.baseUrl + 'users/' + userId + '/photo/' + id);
  }

}
