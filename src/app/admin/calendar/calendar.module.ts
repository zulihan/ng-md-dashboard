import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CalendarModule } from 'angular-calendar';

import { NgbModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { UtilsModule } from './utils/module';

import { CalendarComponent } from './calendar.component';
import { CalendarEditComponent } from './calendar-edit/calendar-edit.component';
import { DayOneComponent } from './day-one/day-one.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    NgbModalModule,
    CalendarModule.forRoot(),
    UtilsModule
  ],
  exports: [
    CalendarComponent,
    CalendarEditComponent,
    DayOneComponent
  ],
  declarations: [
    CalendarComponent,
    CalendarEditComponent,
    DayOneComponent
  ]
})
export class CalModule { }
