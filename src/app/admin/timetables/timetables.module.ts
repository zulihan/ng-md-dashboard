import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DayOneTimetableComponent } from './day-one-timetable/day-one-timetable.component';
import { TimetablesComponent } from './timetables.component';
import { MaterialModule } from 'src/app/material/material.module';
import { AdminRoutingModule } from 'src/app/admin/admin-routing.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    AdminRoutingModule
  ],
  exports: [
    DayOneTimetableComponent,
    TimetablesComponent
  ],
  declarations: [DayOneTimetableComponent, TimetablesComponent]
})
export class TimetablesModule { }
