import { Component,
   OnInit,
   NgZone,
   ChangeDetectorRef,
   OnChanges,
   DoCheck,
   AfterContentInit,
   AfterContentChecked,
   AfterViewInit,
   AfterViewChecked,
   OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ObservableMedia } from '@angular/flex-layout';
import { TasksRegisterComponent } from './tasks-register/tasks-register.component';
import { TasksService } from '../../_services/tasks.service';
import { RunnerTask } from 'src/app/_models/runner-task';
import { Observable, BehaviorSubject } from 'rxjs';
import { TimeService } from '../../_services/time.service';
import { ToastrService } from 'ngx-toastr';
import { TaskEditComponent } from './task-edit/task-edit.component';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements
  OnChanges,
  OnInit,
  DoCheck,
  AfterContentInit,
  AfterContentChecked,
  AfterViewInit,
  AfterViewChecked,
  OnDestroy {

  runnersTasksList: RunnerTask[] = [];
  runnersTasksSubject = new BehaviorSubject< RunnerTask[]>(this.runnersTasksList);
  runnersTasksObservable = this.runnersTasksSubject.asObservable();
  runnersTasks: RunnerTask[];

  runnersTasksStatus = [
    { ts: 'scheduled', checked: false },
    { ts: 'approaching', checked: false },
    { ts: 'due', checked: false },
    { ts: 'late', checked: false },
    { ts: 'ok', checked: false },
    { ts: 'completed', checked: false }
  ];
  filterArr = [];

  rtsCompleted = { rts: 'completed', checked: false};
  hideCompletedArr = [];

  over: boolean;
  timeNow;

  cols;
  rowHeight;


  constructor(
    public dialog: MatDialog,
    private tasksService: TasksService,
    private observableMedia: ObservableMedia,
    private ngZone: NgZone,
    private toastr: ToastrService,
    private changeDetectorRef: ChangeDetectorRef
    ) {

      // changeDetectorRef.detach();
      // setInterval(() => {
      //   this.changeDetectorRef.detectChanges();
      // }, 6000);
     }

  ngOnChanges() {
  // this.runnersTasksSubject.next(this.runnersTasksList);
  // this.runnersTasksObservable.subscribe(rts => console.log('rts:', rts));
  // console.log(`ngOnChanges`);
  }

  ngOnInit() {

    this.tasksService.getRunnersTask().subscribe( tasks => {
      console.log('tasks: ', tasks);
      this.runnersTasksList = [];
      // this.runnersTasksSubject.next(this.runnersTasksList);
      tasks.forEach(rt => {
        const timeNow = new Date().getTime();
        rt.startAt = +new Date(rt.startAt.seconds * 1000).getTime();
        const startTime = new Date(rt.startAt).getTime();
        rt.over = timeNow > startTime ? true : false;
        // rt.taskStatus = 'ok';
        rt.startAtToString = new Date(rt.startAt).toString();
        rt.createdAt = new Date(rt.createdAt).toString();
        rt.closedAt = new Date(rt.closedAt).toString();
        rt.updatedAt = new Date(rt.updatedAt).toString();
        if ( timeNow + 900000 >= startTime && timeNow < startTime  ) {
          rt.taskStatus = 'approaching';
        } else if (timeNow === startTime || (timeNow <= startTime + 300000 && timeNow > startTime)) {
          rt.taskStatus = 'due';
        } else if ( timeNow > startTime + 300000 && rt.status === 'has not started yet') {
          rt.taskStatus = 'late';
          console.log('is late ?: ', rt.taskStatus);
          rt.taskStatus = 'late';
        } else if ( timeNow > startTime &&
          (rt.status === 'has started' ||
          rt.status === 'has arrived at destination' ||
          rt.status === 'is on the way back')) {
          console.log('is ok ?: ', rt.taskStatus);
          rt.taskStatus = 'ok';
        } else if ( timeNow > startTime && rt.status === 'has completed') {
           rt.taskStatus = 'completed';
        }
        console.log('task in forEach: ', rt);
        this.runnersTasksList.push(rt);
        console.log('this.runnersTasksList in forEach', this.runnersTasksList);
      });
      console.log('tasks in constructor: ', tasks);
      console.log('this.runnersTasksList in constructor', this.runnersTasksList);

      this.runnersTasksList.forEach((rt, index) => {
        if (rt.over === true) {
          return;
        } else {
          return this.isOver(rt);
        }
      });

      this.runnersTasksList.forEach((rt, index) => {
        if ((rt.over === true && (rt.taskStatus === 'ok' || rt.taskStatus === 'late'))) {
          return;
        } else {
          this.checkTaskStatus(rt);
        }
      });

      this.runnersTasksSubject.next(this.runnersTasksList);
      this.runnersTasksObservable.subscribe( rts => this.runnersTasks = rts);

      // this.runnersTasksObservable.subscribe( rt => {
      //   return this.runnersTasks = rt;
      // } );
    });

      // this.filteredList = rt.filter(rtasks => rtasks['taskStatus'] === 'ok');
      //     console.log('this runnersTasks: ', this.runnersTasks);
      //     console.log('this.filteredList', this.filteredList);
      //     return this.filteredList;



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

  ngDoCheck() {
    // console.log('ngDoCheck');
  }

  ngAfterContentInit() {
    console.log('ngAfterContentInit');
  }

  ngAfterContentChecked() {

    // console.log('ngAfterContentChecked');
  }

  ngAfterViewInit() {
    console.log('ngAfterViewInit');
  }

  ngAfterViewChecked() {
    // console.log('ngAfterViewChecked');
  }

  ngOnDestroy() {
    console.log('ngOnDestroy');
  }

  filteredLateStatus(arr) {
    return arr.filter(rtasks => rtasks.taskStatus === 'late');
  }


  heightToCols(cols: number): number {
    if (cols === 1) {
      return 450;
    } else if (cols === 2) {
      return 450;
    } else {
      return 450;
    }

  }

  openRegisterDialog(): void {
    const dialogRef = this.dialog.open(TasksRegisterComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  openEdit(runnerTask): void {
    console.log('runner task from openEdit', runnerTask);
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
          console.log('response from deleteRunnerTask: ', response);
          this.showEditSuccess(name);
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


  isOver(runnerTask) {
    console.log('runner Task from isOver(): ', runnerTask);
    this.ngZone.runOutsideAngular( _ => {
        if (typeof window !== 'undefined') {
          let isOVerInterval;
          return isOVerInterval = window.setInterval(() => {
            if (runnerTask.over === true) {
              clearInterval(isOVerInterval);
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
          }, 6000);
      }});

  }


  checkTaskStatus(runnerTask) {
    this.ngZone.runOutsideAngular( _ => {
      if (typeof window !== 'undefined') {
        let checkStatusInterval;
        return checkStatusInterval = window.setInterval(() => {
          const dateNow = new Date().getTime();
          const start = new Date(runnerTask.startAt).getTime();
          if (runnerTask.taskStatus === 'ok' ||
              runnerTask.taskStatus === 'late' ||
              runnerTask.taskStatus === 'completed') {
            clearInterval(checkStatusInterval);
          } else if ( dateNow + 900000 >= start && dateNow < start  ) {
            return runnerTask.taskStatus = 'approaching';
          } else if (dateNow === start || (dateNow <= start + 300000 && dateNow > start)) {
            return runnerTask.taskStatus = 'due';
          } else if ( dateNow > start + 300000 && runnerTask.status === 'has not started yet') {
            runnerTask.taskStatus = 'late';
            console.log('is late ?: ', runnerTask.taskStatus);
            return runnerTask.taskStatus = 'late';
          } else if ( dateNow > start &&
            (runnerTask.status === 'has started' ||
            runnerTask.status === 'has arrived at destination' ||
            runnerTask.status === 'is on the way back')) {
            console.log('is ok ?: ', runnerTask.taskStatus);
            return runnerTask.taskStatus = 'ok';
          } else if ( dateNow > start && runnerTask.status === 'has completed') {
            return runnerTask.taskStatus = 'completed';
          }
        }, 6000);
      }
    });

  }
}


// isOver(runnerTask) {
//   const dateNow = new Date().getTime();
//   const start = new Date(runnerTask.startAt).getTime();
//   console.log('runner Task from isOver(): ', runnerTask);
//   if (runnerTask.over === true) {
//     console.log('start at from isOver(): ', start);
//     console.log('dateNow from isOver(): ', dateNow);
//     return;
//   } else {
//     this.ngZone.runOutsideAngular( _ => {
//       if (typeof window !== 'undefined') {
//         let isOVerInterval;
//         return isOVerInterval = window.setInterval(() => {
//           if (runnerTask.over === true) {
//             clearInterval(isOVerInterval);
//           } else {
//             const timeNow = new Date().getTime();
//             const startTime = new Date(runnerTask.startAt).getTime();
//             console.log('time now:', timeNow);
//             console.log('start at:', startTime);
//             console.log('runnerTask over ?: ', runnerTask.over);
//             return timeNow > startTime ? true : false;
//           }
//         }, 6000);
//     }});

//   }
// }

// checkTaskStatus(runnerTask) {
//   const dateNow = new Date().getTime();
//   const start = new Date(runnerTask.startAt).getTime();
//   if ( dateNow + 900000 >= start && dateNow !== start ) {
//     runnerTask.taskStatus = 'approaching';
//   } else if (dateNow === start || dateNow <= start + 300000) {
//     runnerTask.taskStatus = 'due';
//   } else if ( dateNow > start + 300000 && runnerTask.status === 'has not started yet') {
//     runnerTask.taskStatus = 'late';
//   } else if ( dateNow > start &&
//     (runnerTask.status === 'has started' ||
//     runnerTask.status === 'has arrived at destination' ||
//     runnerTask.status === 'has completed')) {
//     runnerTask.taskStatus = 'ok';
//   }
// }
