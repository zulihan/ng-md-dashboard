import { Component, OnInit } from '@angular/core';
import { Runz } from 'src/app/_models/runz';

@Component({
  selector: 'app-task-progress',
  templateUrl: './task-progress.component.html',
  styleUrls: ['./task-progress.component.scss']
})
export class TaskProgressComponent implements OnInit {
  run: Runz;

  constructor() { }

  ngOnInit() {
  }

}
