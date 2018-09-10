import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { GetIn } from 'src/app/_models/getin';
import { SetUpWings } from '../../../_models/setupwings';

@Injectable({
  providedIn: 'root'
})
export class TimetablesService {

  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getTimeTableByDay(dayId: number): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl + 'timetables/timetable/' + dayId);
  }

  getGetInsByDay(dayId: number): Observable<GetIn[]> {
    return this.http.get<GetIn[]>(this.baseUrl + 'timetables/getins/' + dayId);
  }

  getSetUpWingsByDay(dayId: number): Observable<SetUpWings[]> {
    return this.http.get<SetUpWings[]>(this.baseUrl + 'timetables/setup/' + dayId);
  }

}
