import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

import { Timetable } from '../_timetable/timetable';
import { Renderer } from '../_timetable/renderer';
import { Scope } from '../_timetable/_models/scope';
import { TimetablesService } from '../_service/timetables.service';
import { TasksService } from '../../../_services/tasks.service';
import { Runner } from 'src/app/_models/runner';
import { RunnerTask } from 'src/app/_models/runner-task';
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
        rts.forEach(rt => this.runners.push(rt.runner));
        this.runnerTasks = rts;
        console.log('runners: ', this.runners);
        this.addTimeTable(this.timetable, this.selector );
      });
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
