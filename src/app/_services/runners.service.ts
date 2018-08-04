import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { environment } from '../../environments/environment';
import {Observable} from 'rxjs/Observable';
import { Runner } from '../_models/runner';
import 'rxjs/add/operator/map';

@Injectable()
export class RunnersService {

    BASE_URL =  environment.apiUrl;

    constructor(private http: Http) { }

    getRunners(): Observable<Runner[]> {
        return this.http.get(this.BASE_URL + 'runners')
            .map(response => <Runner[]>response.json());
    }

}
