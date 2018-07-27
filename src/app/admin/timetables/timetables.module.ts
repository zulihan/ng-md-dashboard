import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DayOneTimetableComponent } from './day-one-timetable/day-one-timetable.component';
import { TimetablesComponent } from './timetables.component';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    DayOneTimetableComponent,
    TimetablesComponent
  ],
  declarations: [DayOneTimetableComponent, TimetablesComponent]
})
export class TimetablesModule { }
