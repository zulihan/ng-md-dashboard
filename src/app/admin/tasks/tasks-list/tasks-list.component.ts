import { Component,
  OnInit,
  NgZone,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { MatDialog } from '@angular/material';
import { ObservableMedia } from '@angular/flex-layout';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ToastrService } from 'ngx-toastr';

import { Enums, RunStatus, TaskStatus } from "src/app/_enums/enums";
// import { RunStatus } from "src/app/_enums/run-status.enum";
// import { TaskStatus } from "src/app/_enums/task-status.enum";

import { TasksService } from '../../../_services/tasks.service';
import { GeoService } from '../../../_services/geo.service';

import { RunnerTask } from 'src/app/_models/runner-task';

import { TaskEditComponent } from '../task-edit/task-edit.component';
import { RunzService } from 'src/app/_services/runz.service';

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.scss']
})
export class TasksListComponent implements OnInit, OnDestroy {

  // public taskStatus = TaskStatus;
  // public runStatus = RunStatus;

  runnersTasksList: RunnerTask[] = [];
  runnersTasksSubject = new BehaviorSubject< RunnerTask[]>(this.runnersTasksList);
  runnersTasksObservable = this.runnersTasksSubject.asObservable();
  runnersTasks: RunnerTask[];

  estimatedTravelTime;

  runnersTasksStatus = [
    { ts: TaskStatus.DONE, checked: false },
    { ts: TaskStatus.APPROACHING, checked: false },
    { ts: TaskStatus.DUE, checked: false },
    { ts: TaskStatus.LATE, checked: false },
    { ts: TaskStatus.OK, checked: false },
    { ts: TaskStatus.SCHEDULED, checked: false }
  ];
  filterArr = [];

  rtsCompleted = { rts: 'completed', checked: false};
  hideCompletedArr = [];

  over: boolean;
  isOVerInterval;
  timeNow;

  cols;
  rowHeight;

  panelOpenState = false;

  constructor(
    public dialog: MatDialog,
    private tasksService: TasksService,
    private runzService: RunzService,
    private observableMedia: ObservableMedia,
    private ngZone: NgZone,
    private toastr: ToastrService,
    private changeDetectorRef: ChangeDetectorRef,
    private geo: GeoService
    ) {

      // changeDetectorRef.detach();
      // setInterval(() => {
      //   this.changeDetectorRef.detectChanges();
      // }, 6000);
     }

  ngOnInit() {

    this.tasksService.getRunnersTask().subscribe( tasks => {
      this.runnersTasksList = [];
      // this.runnersTasksSubject.next(this.runnersTasksList);
      tasks.map( rt => this.runnersTasksList.push(rt));
      this.runnersTasksList.forEach(rt => {
        this.formatTask(rt);
        this.determineTaskStatus(rt);
        console.log(' ngOnInit -> determineTaskStatus');
        if (rt.over === false) {
          if (!(rt.taskStatus === TaskStatus.OK || rt.taskStatus === TaskStatus.LATE)) {
            this.checkTaskStatus(rt);
          }
          this.isOver(rt);
        }
      });
      console.log('TasksListComponent ->  ngOnInit ->  this.runnersTasksList', this.runnersTasksList);
      
      this.runnersTasksSubject.next(this.runnersTasksList);
      this.runnersTasksObservable.subscribe( rts => this.runnersTasks = rts);

      // this.runnersTasksObservable.subscribe( rt => {
      //   return this.runnersTasks = rt;
      // } );
      // const userLocation = { longitude: 43.270584762037416, latitude: 5.39729277752383};
      // const location = {name: 'hotel', coord: {latitude: 43.2794, longitude: 5.3891}};

      // estimatedTravelTime = this.geo.getEstimatedTravelTime(userLocation, location);
        // this. estimatedTravelTime = res

        // this.filteredList = rt.filter(rtasks => rtasks['taskStatus'] === 'ok');
        // console.log('this runnersTasks: ', this.runnersTasks);
        // console.log('this.filteredList', this.filteredList);
        // return this.filteredList;
    });

    const grid = new Map([
      ['xs', 1],
      ['sm', 1],
      ['md', 2],
      ['lg', 3],
      ['xl', 3]
    ]);

    let start: number;

    grid.forEach((cols, mqAlias) => {
      if (this.observableMedia.isActive(mqAlias)) {
        start = cols;
      }
    });

    // on breakpoint, assign cols AND ROW HEIGHT appropriately
    this.cols = this.observableMedia.asObservable()
      .map(change => {
        this.rowHeight = this.heightToCols(grid.get(change.mqAlias));
        // console.log(this.rowHeight);
        return grid.get(change.mqAlias);
      })
      .startWith(start);
  }

  filteredLateStatus(arr) {
    return arr.filter(rtasks => rtasks.taskStatus === TaskStatus.LATE);
  }


  heightToCols(cols: number): number {
    if (cols === 1) {
      return 470;
    } else if (cols === 2) {
      return 470;
    } else {
      return 470;
    }

  }

  openEdit(runnerTask): void {
    console.log('TasksListComponent -> runner task from openEdit', runnerTask);
    const dialogRef = this.dialog.open(TaskEditComponent, {
      width: '500px',
      data: {
        dataKey: runnerTask
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });

  }

  delete(task) {
    if (confirm('Are you sure to delete this task ?')) {
      this.tasksService.deleteRunnerTask(task)
        .then(response => {
          this.runzService.deleteRun(task.runId)
            .then( () => this.showEditSuccess(name))
            .catch( error => console.log(' delete -> error', error))            
        }).catch(error => {
          this.showEditError(error);
        });
    }
  }

  showEditSuccess(response) {
    this.toastr.success('You\'ve susccesfully deleted the task');
  }

  showEditError(error) {
    this.toastr.error(error);
  }

/**
 * Format the task fields 
 *
 * @this {formatTask}
 * @param {RunnerTask} runnerTask the task you want to format.
 */
  formatTask(runnerTask) {
    runnerTask.distance = (runnerTask.distance / 1000).toFixed(1) + ' km';
    runnerTask.estimatedDuration = runnerTask.estimatedDuration !== undefined ? this.convertSecondsToHrsMinsSec(runnerTask.estimatedDuration) : '';
    runnerTask.startAt = +new Date(runnerTask.startAt.seconds * 1000).getTime();
    runnerTask.startAtToString = new Date(runnerTask.startAt).toString();
    runnerTask.createdAt = new Date(runnerTask.createdAt).toString();
    runnerTask.closedAt = new Date(runnerTask.closedAt).toString();
    runnerTask.updatedAt = new Date(runnerTask.updatedAt).toString();
  }

/**
 * Determine what the task status should be according to actual time 
 *
 * @this {determineTaskStatus}
 * @param {RunnerTask} runnerTask the task you want to check status.
 */
  determineTaskStatus(runnerTask) {
    const timeNow = new Date().getTime(); 
    const startTime = new Date(runnerTask.startAt).getTime(); 
    runnerTask.over = timeNow > startTime ? true : false;
    if ( timeNow + 900000 >= startTime && timeNow < startTime  ) {
      runnerTask.taskStatus =  TaskStatus.APPROACHING;
    } else if (timeNow < startTime) {
      runnerTask.taskStatus = TaskStatus.OK;
    } else if (timeNow === startTime || (timeNow <= startTime + 300000 && timeNow > startTime)) {
      runnerTask.taskStatus = TaskStatus.DUE;
    } else if ( timeNow > startTime + 300000 && runnerTask.status === RunStatus.NOT_STARTED) {
      runnerTask.taskStatus = TaskStatus.LATE;
    } else if ( timeNow > startTime &&
      (runnerTask.status === RunStatus.STARTED ||
      runnerTask.status === RunStatus.ARRIVED_AT_DESTINATION ||
      runnerTask.status === RunStatus.ON_THE_WAY_BACK)) {
      runnerTask.taskStatus = TaskStatus.OK;
    } else if ( timeNow > startTime && runnerTask.status === RunStatus.COMPLETED) {
       runnerTask.taskStatus = TaskStatus.DONE;
    }    
  }

/**
 * Sets an interval to check weither actual time is over departure time
 *
 * @this {isOver}
 * @param {RunnerTask} runnerTask the task you want to check status.
 */
  isOver(runnerTask) {
    this.ngZone.runOutsideAngular( _ => {
        if (typeof window !== 'undefined') {
          this.isOVerInterval;
          return this.isOVerInterval = window.setInterval(() => {
            if (runnerTask.over === true) {
              clearInterval(this.isOVerInterval);
            } else {
              const dateNow = new Date().getTime();
              const start = new Date(runnerTask.startAt).getTime();
              console.log('time now:', dateNow);
              console.log('start at:', start);
              console.log('runnerTask over ?: ', runnerTask.over);
              runnerTask.over = dateNow > start ? true : false;
              // this.changeDetectorRef.detach();
              // this.changeDetectorRef.detectChanges();
              return runnerTask.over;
            }
          }, 60000);
      }});
  }

/**
 * Sets an interval to check and set the task status
 * Task status: departure time against actual time
 *
 * @this {checkTaskStatus}
 * @param {RunnerTask} runnerTask the task you want to check status.
 */
  checkTaskStatus(runnerTask) {
    this.ngZone.runOutsideAngular( _ => {
      if (typeof window !== 'undefined') {
        let checkStatusInterval;
        return checkStatusInterval = window.setInterval(() => {
          const dateNow = new Date().getTime();
          const start = new Date(runnerTask.startAt).getTime();
          if (runnerTask.taskStatus === TaskStatus.OK ||
              runnerTask.taskStatus === TaskStatus.LATE ||
              runnerTask.taskStatus === TaskStatus.DONE ||
              dateNow < start - 900000) {
            clearInterval(checkStatusInterval);
          } else if ( dateNow + 900000 >= start && dateNow < start  ) {
            return runnerTask.taskStatus = TaskStatus.APPROACHING;
          } else if (dateNow === start || (dateNow <= start + 300000 && dateNow > start)) {
            return runnerTask.taskStatus = TaskStatus.DUE;
          } else if ( dateNow > start + 300000 && runnerTask.status === RunStatus.NOT_STARTED) {
            runnerTask.taskStatus = TaskStatus.LATE;
            console.log('is late ?: ', runnerTask.taskStatus);
            return runnerTask.taskStatus = TaskStatus.LATE;
          } else if ( dateNow > start &&
            (runnerTask.status === RunStatus.STARTED ||
            runnerTask.status === RunStatus.ARRIVED_AT_DESTINATION ||
            runnerTask.status === RunStatus.ON_THE_WAY_BACK)) {
            console.log('is ok ?: ', runnerTask.taskStatus);
            return runnerTask.taskStatus = TaskStatus.OK;
          } else if ( dateNow > start && runnerTask.status === RunStatus.COMPLETED) {
            return runnerTask.taskStatus = TaskStatus.DONE;
          }
        }, 60000);
      }
    });

  }

  convertMinsToHrsMins(minutes: number) {
    let h = Math.floor(minutes / 60);
    let m = minutes % 60;
    h = h < 10 ? 0 + h : h;
    m = m < 10 ? 0 + m : m;
    return h + ':' + m;
  }

  convertSecondsToHrsMinsSec(seconds: number) {
    const date = new Date(null);
    date.setSeconds(seconds); // specify value for SECONDS here
    const result = date.toISOString().substr(11, 8);
    return result;
  }

  ngOnDestroy(){
    clearInterval(this.isOVerInterval);
  }

}
