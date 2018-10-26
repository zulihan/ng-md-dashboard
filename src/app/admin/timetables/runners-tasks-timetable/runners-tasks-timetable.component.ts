import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

import { Timetable } from '../_timetable/timetable';
import { Renderer } from '../_timetable/renderer';
import { Scope } from '../_timetable/_models/scope';
import { TimetablesService } from '../_service/timetables.service';
import { TasksService } from '../../../_services/tasks.service';
import { Runner } from 'src/app/_models/runner';
import { RunnerTask } from 'src/app/_models/runner-task';
import { IsEqual } from 'src/app/_helpers/isEqual';
// import 'rxjs/add/operator/map';

@Component({
  selector: 'app-runners-tasks-timetable',
  templateUrl: './runners-tasks-timetable.component.html',
  styleUrls: ['./runners-tasks-timetable.component.scss']
})
export class RunnersTasksTimetableComponent implements OnInit {

  @ViewChild('runnerstimetable') runnerstimetable: ElementRef;
  selector;
  timetable: Timetable;
  runnersTimetable: any;

  scope: Scope;
  scopeTime: number;

  runnerTasks: RunnerTask[];
  runners: Runner[] = [];

  dateNow = new Date();
  timeNow = +(this.dateNow.getHours() + (this.dateNow.getMinutes() / 60)).toFixed(2);

  options = {
    class: 'setupwings',
    onClick: (event) => { window.alert(event.description); }
  };

  constructor(
    private timeTableService: TimetablesService,
    private tasksService: TasksService) {
      this.timetable = new Timetable();
     }

  ngOnInit() {
    this.selector =  this.runnerstimetable.nativeElement;
    this.tasksService.getRunnersTask()
      .subscribe(rts => {
        this.runners = [];
        console.log(' RunnersTasksTimetableComponent -> this.runners -> Before for', this.runners);
        for (let i = 0; i < rts.length; i ++ ) {
          console.log('in first for loop');
          this.runners.push(rts[i].runner);
        }

        // Remove duplicates
        const obj = {};
        for (let i = 0; i < this.runners.length; i++ ) {
          obj[this.runners[i]['userName']] = this.runners[i];
          console.log(' ngOnInit -> obj', obj);
        }
        this.runners = new Array();
        // tslint:disable-next-line:forin
        for (const key in obj) {
          this.runners.push(obj[key]);
        }

        console.log(' RunnersTasksTimetableComponent -> this.runners  -> after if', this.runners);

        this.runnerTasks = rts;
        console.log('runners: ', this.runners);
        this.addTimeTable(this.timetable, this.selector);
      });
  }


  // for (let j = this.runners.length - 1; j >= 0; j--) {
  //   console.log('insecond for loop');
  //   console.log(' ngOnInit -> rts[i].runner.userName', rts[i].runner.userName);
  //   console.log(' ngOnInit -> this.runners[j].userName', this.runners[j].userName);
  //   if (rts[i].runner.userName === this.runners[j].userName) {
  //     // tslint:disable-next-line:max-line-length
  //     console.log(' ngOnInit -> this.runners[i] === this.runners[j].userName', this.runners[i].userName === this.runners[j].userName);
  //     console.log(' ngOnInit -> this.runners.indexOf(this.runners[j] ', this.runners.indexOf(this.runners[j]));
  //     this.runners.slice(this.runners.indexOf(this.runners[j]), 1);
  //   }
  // }


  // for (let i = 0; i < rts.length; i ++ ) {
  //   console.log('in first for loop');
  //   this.runners.push(rts[i].runner);
  //   for (let j = 0; j < this.runners.length; j++) {
  //     console.log('insecond for loop');
  //     if (rts[i].runner.userName !== this.runners[j].userName) {
  //       console.log(' ngOnInit -> rts[i].runner.userName', rts[i].runner.userName);
  //       this.runners.push(rts[i].runner);
  //     }
  //   }
  // }

  // for (let i = 0; i < rts.length; i ++ ) {
  //   for (let j = 0; j < this.runners.length; j++) {
  //     if (this.runnertExistsIn(this.runners[j], this.runners)) {
  //       const index = this.runners.indexOf(this.runners[j]);
  //       this.runners.slice(index, 1);
  //     }
  //   }

  // rts.forEach(rt => {
  //   console.log(' RunnersTasksTimetableComponent -> ngOnInit -> rt.runner', rt.runner);
  //   console.log(
  //     ' RunnersTasksTimetableComponent -> ngOnInit -> !this.runnertExistsIn', !this.runnertExistsIn(rt.runner, this.runners));
  //   if (!this.runnertExistsIn(rt.runner, this.runners)) {
  //     this.runners.push(rt.runner);
  //   }
  // });
  // this.runnerTasks = rts;
  // console.log('runners: ', this.runners);
  // this.addTimeTable(this.timetable, this.selector);



  // runnertExistsIn(runner, runners) {
  //   let i = runners.length;
  //   while (i--) {
  //      if (runners[i] === runner) {
  //          return true;
  //      }
  //   }
  //   return false;
  // }

  // runnertExistsIn(runner, runners) {
  //   let x;
  //   for (x in runners) {
  //       if (runners.hasOwnProperty(x) && runners[x] === runner) {
  //           return true;
  //       }
  //   }
  //   return false;
  // }

  isEqual(value, other) {

    // Get the value type
    const type = Object.prototype.toString.call(value);
    // If the two objects are not the same type, return false
    if (type !== Object.prototype.toString.call(other)) {return false; }

    // If items are not an object or array, return false
    if (['[object Array]', '[object Object]'].indexOf(type) < 0) {return false; }

    // Compare the length of the length of the two items
    const valueLen = type === '[object Array]' ? value.length : Object.keys(value).length;
    const otherLen = type === '[object Array]' ? other.length : Object.keys(other).length;
    if (valueLen !== otherLen) {return false; }

    // Compare two items
    const compare = function (item1, item2) {

      // Get the object type
      const itemType = Object.prototype.toString.call(item1);

      // If an object or array, compare recursively
      if (['[object Array]', '[object Object]'].indexOf(itemType) >= 0) {
        if (!this.isEqual(item1, item2)) {return false; }
      } else {
        // Otherwise, do a simple comparison
        // If the two items are not the same type, return false
        if (itemType !== Object.prototype.toString.call(item2)) {return false; }

        // Else if it's a function, convert to a string and compare
        // Otherwise, just compare
        if (itemType === '[object Function]') {
          if (item1.toString() !== item2.toString()) {return false; }
        } else {
          if (item1 !== item2) {return false; }
        }

      }
    };

    // Compare properties
    if (type === '[object Array]') {
      for (let i = 0; i < valueLen; i++) {
        if (compare(value[i], other[i]) === false) {return false; }
      }
    } else {
      for (const key in value) {
        if (value.hasOwnProperty(key)) {
          if (compare(value[key], other[key]) === false) {return false; }
        }
      }
    }

    // If nothing failed, return true
    return true;

  }

  addTimeTable(tt, selector) {

    tt.setScope(10, 10);

    const runners: string[] = [];

    this.runners.forEach(r => runners.push(r.userName.toUpperCase()));
    tt.addArtists(runners);

    this.runnerTasks.forEach( rt => {
      const name = rt.artist.name;
      const end = rt.estimatedDuration !== undefined ?
        rt.startAt.seconds * 1000 + ( +rt.estimatedDuration * 1000 ) :
        rt.startAt.seconds * 1000 + ( 2600 * 1000 );
      console.log('start:', new Date(rt.startAt.seconds * 1000));
      console.log('end:', new Date(end));
      // const taskName = rt.artist.name + ' ' + rt.pers.toString() + ' ' + 'pers';
      // console.log('taskName:', taskName);
      const description =
      rt.runner.userName +
       ' takes members of ' +
       name +
       ' - ' +
       rt.pers +
       ' persons' +
       ' from: ' +
       rt.from.name +
       ' to: ' +
       rt.to.name;
      tt.addEvent('', rt.runner.userName.toUpperCase(), new Date(rt.startAt.seconds * 1000), new Date(end), this.options, description);
    });

    const renderer = new Renderer(tt);
    renderer.draw(selector);
    document.getElementById('time').scrollIntoView({behavior: 'instant', block: 'center', inline: 'nearest'});
  }

}
