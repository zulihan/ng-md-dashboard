import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ObservableMedia } from '@angular/flex-layout';
import { TasksRegisterComponent } from './tasks-register/tasks-register.component';
import { TasksService } from '../../_services/tasks.service';
import { RunnerTask } from 'src/app/_models/runner-task';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {

  runnersTasks: RunnerTask[];

  cols;
  rowHeight;

  constructor(
    public dialog: MatDialog,
    private tasksService: TasksService,
    private observableMedia: ObservableMedia
    ) { }

  ngOnInit() {
    this.tasksService.getRunnersTask().subscribe( tasks => {
      console.log('tasks: ', tasks);
      this.runnersTasks = tasks;
      this.runnersTasks.forEach(rt => {
        rt.startAt = new Date(rt.startAt).toString();
        rt.createdAt = new Date(rt.createdAt).toString();
        rt.closedAt = new Date(rt.closedAt).toString();
        rt.updatedAt = new Date(rt.updatedAt).toString();
      });
    });


    const grid = new Map([
      ['xs', 1],
      ['sm', 1],
      ['md', 2],
      ['lg', 4],
      ['xl', 4]
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

}
