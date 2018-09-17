import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ObservableMedia } from '@angular/flex-layout';
import { TasksRegisterComponent } from './tasks-register/tasks-register.component';
import { TasksService } from '../../_services/tasks.service';
import { RunnerTask } from 'src/app/_models/runner-task';
import { Observable } from 'rxjs';
import { TimeService } from '../../_services/time.service';
import { ToastrService } from 'ngx-toastr';
import { TaskEditComponent } from './task-edit/task-edit.component';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {

  runnersTasks: RunnerTask[];

  over: boolean;
  timeNow;

  cols;
  rowHeight;


  constructor(
    public dialog: MatDialog,
    private tasksService: TasksService,
    private observableMedia: ObservableMedia,
    private ngZone: NgZone,
    private toastr: ToastrService
    ) { }

  ngOnInit() {
    this.tasksService.getRunnersTask().subscribe( tasks => {
      console.log('tasks: ', tasks);
      tasks.forEach(rt => {
        rt.startAt = +new Date(rt.startAt.seconds * 1000).getTime();
        this.isOver(rt);
        this.checkTaskStatus(rt);
        rt.startAtToString = new Date(rt.startAt).toString();
        rt.createdAt = new Date(rt.createdAt).toString();
        rt.closedAt = new Date(rt.closedAt).toString();
        rt.updatedAt = new Date(rt.updatedAt).toString();
        console.log('tasks in forEach: ', tasks);
      });
      this.runnersTasks = tasks;
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

  openEdit(artist): void {
    console.log('artist from openEdit', artist);
    const dialogRef = this.dialog.open(TaskEditComponent, {
      width: '500px',
      data: {
        dataKey: artist
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
    const dateNow = new Date().getTime();
    const start = new Date(runnerTask.startAt).getTime();
    if (dateNow > start) {
      console.log('start at from isOver(): ', start);
      console.log('dateNow from isOver(): ', dateNow);
      return runnerTask.over = true;
    } else {
      this.ngZone.runOutsideAngular( _ => {
        if (typeof window !== 'undefined') {
          return window.setInterval(() => {
            if (runnerTask.over === true) {
              return true;
            } else {
              const timeNow = new Date().getTime();
              const startTime = new Date(runnerTask.startAt).getTime();
              console.log('time now:', timeNow);
              console.log('start at:', startTime);
              console.log('over ?: ', timeNow > startTime ? true : false);
              return timeNow > startTime ? runnerTask.over = true : runnerTask.over = false;
            }
          }, 6000);
      }});

    }
  }

  checkTaskStatus(runnerTask) {
    this.ngZone.runOutsideAngular( _ => {
      if (typeof window !== 'undefined') {
        return window.setInterval(() => {
          const dateNow = new Date().getTime();
          const start = new Date(runnerTask.startAt).getTime();
          if ( dateNow + 900000 >= start && dateNow < start  ) {
            runnerTask.taskStatus = 'approaching';
          } else if (dateNow === start || dateNow <= start + 300000) {
            runnerTask.taskStatus = 'due';
          } else if ( dateNow > start + 300000 && runnerTask.status === 'has not started yet') {
            runnerTask.taskStatus = 'late';
          } else if ( dateNow > start &&
            (runnerTask.status === 'has started' ||
            runnerTask.status === 'has arrived at destination' ||
            runnerTask.status === 'is on the way back' ||
            runnerTask.status === 'has completed')) {
            runnerTask.taskStatus = 'ok';
          }
        });
      }
    });

  }
}

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
