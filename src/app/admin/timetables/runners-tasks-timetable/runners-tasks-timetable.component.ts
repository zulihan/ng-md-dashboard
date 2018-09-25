import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

import { Timetable } from '../_timetable/timetable';
import { Renderer } from '../_timetable/renderer';
import { Scope } from '../_timetable/_models/scope';
import { TimetablesService } from '../_service/timetables.service';
import { TasksService } from '../../../_services/tasks.service';
import { Runner } from 'src/app/_models/runner';
// import 'rxjs/add/operator/map';

@Component({
  selector: 'app-runners-tasks-timetable',
  templateUrl: './runners-tasks-timetable.component.html',
  styleUrls: ['./runners-tasks-timetable.component.scss']
})
export class RunnersTasksTimetableComponent implements OnInit {

  @ViewChild('runnersTimetable') runnerstimetable: ElementRef;
  selector;
  timetable: Timetable;
  runnersTimetable: any;

  scope: Scope;
  scopeTime: number;

  runners: Runner[];

  dateNow = new Date();
  timeNow = +(this.dateNow.getHours() + (this.dateNow.getMinutes() / 60)).toFixed(2);

  constructor(
    private timeTableService: TimetablesService,
    private tasksService: TasksService) { }

  ngOnInit() {
    this.selector =  this.runnerstimetable.nativeElement;
    this.tasksService.getRunnersTask()
      .subscribe(rts => {
        this.runners = rts.map(rt => this.runners.push(rt.userName));
        console.log('runners: ', this.runners);
      });
  }


