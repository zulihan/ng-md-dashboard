import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { TasksRegisterComponent } from './tasks-register/tasks-register.component';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {
  active;


  constructor(public dialog: MatDialog) {}

  ngOnInit() {}

  openRegisterDialog(): void {
    const dialogRef = this.dialog.open(TasksRegisterComponent, {
      width: '300px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}
