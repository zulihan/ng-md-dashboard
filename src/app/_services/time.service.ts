import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimeService {

isOver: BehaviorSubject<boolean>;

constructor() {}

getTimeNow() {
  return Date.now();
}

getIsover(): Observable<boolean> {
  return this.isOver.asObservable();
}

setIsOver(runnerTask): Observable<boolean> {
  const isOver = (new Date(runnerTask.start).getTime()) > this.getTimeNow() ? true : false;
    this.isOver.next(isOver);
  return this.isOver.asObservable();
}

}
