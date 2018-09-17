import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NameFilterPipe } from './name-filter.pipe';
import { RoleFilterPipe } from './role-filter.pipe';
import { UserNameFilterPipe } from './userName-filter.pipe';
import { DayFilterPipe } from './day-filter.pipe';
import { VenueFilterPipe } from './venue-filter.pipe';
import { CountdownPipe } from './countdown.pipe';
import {TimeAgoPipe} from 'time-ago-pipe';




@NgModule({
   imports: [
      CommonModule
   ],
   declarations: [
      NameFilterPipe,
      RoleFilterPipe,
      UserNameFilterPipe,
      DayFilterPipe,
      VenueFilterPipe,
      CountdownPipe,
      TimeAgoPipe

   ],
   exports: [
      NameFilterPipe,
      RoleFilterPipe,
      UserNameFilterPipe,
      DayFilterPipe,
      VenueFilterPipe,
      CountdownPipe,
      TimeAgoPipe
   ]
})
export class PipesModule { }
