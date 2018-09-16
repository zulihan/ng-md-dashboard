import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DayOneTimetableComponent } from './day-one-timetable/day-one-timetable.component';
import { TimetablesComponent } from './timetables.component';
import { MaterialModule } from 'src/app/material/material.module';
import { AdminRoutingModule } from 'src/app/admin/admin-routing.module';
import { DayTwoTimetableComponent } from './day-two-timetable/day-two-timetable.component';
import { DayOneVenueOneTimetableComponent } from './day-one-venue-one-timetable/day-one-venue-one-timetable.component';
import { DayOneVenueTwoTimetableComponent } from './day-one-venue-two-timetable/day-one-venue-two-timetable.component';
import { DayOneVenueThreeTimetableComponent } from './day-one-venue-three-timetable/day-one-venue-three-timetable.component';
import { DayTwoVenueOneTimetableComponent } from './day-two-venue-one-timetable/day-two-venue-one-timetable.component';
import { DayTwoVenueTwoTimetableComponent } from './day-two-venue-two-timetable/day-two-venue-two-timetable.component';
import { DayTwoVenueThreeTimetableComponent } from './day-two-venue-three-timetable/day-two-venue-three-timetable.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    AdminRoutingModule
  ],
  exports: [
    DayOneTimetableComponent,
    DayTwoTimetableComponent,
    DayOneVenueOneTimetableComponent,
    DayOneVenueTwoTimetableComponent,
    DayOneVenueThreeTimetableComponent,
    DayTwoVenueOneTimetableComponent,
    DayTwoVenueTwoTimetableComponent,
    DayTwoVenueThreeTimetableComponent,
    TimetablesComponent
  ],
  declarations: [
    DayOneTimetableComponent,
    DayTwoTimetableComponent,
    DayOneVenueOneTimetableComponent,
    DayOneVenueTwoTimetableComponent,
    DayOneVenueThreeTimetableComponent,
    DayTwoVenueOneTimetableComponent,
    DayTwoVenueTwoTimetableComponent,
    DayTwoVenueThreeTimetableComponent,
    TimetablesComponent
  ]
})
export class TimetablesModule { }
