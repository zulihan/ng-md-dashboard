import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/guard/auth.guard';

import { DashboardComponent } from './dashboard/dashboard.component';
import { NotFoundComponent } from '../views/errors/not-found/not-found.component';
import { AdminComponent } from './admin.component';
import { MapComponent } from '../map/map/map.component';
// import { ArtistsListComponent } from './artists/artists-list/artists-list.component';
import { ArtistsComponent } from './artists/artists.component';
import { CalendarComponent } from './calendar/calendar.component';
import { CalendarEditComponent } from './calendar/calendar-edit/calendar-edit.component';
import { DayOneComponent } from './calendar/day-one/day-one.component';
import { TimetablesComponent } from './timetables/timetables.component';
import { DayOneTimetableComponent } from './timetables/day-one-timetable/day-one-timetable.component';

// { path: 'admin', canActivate: [AuthGuard] , redirectTo: 'admin/dashboard/v1'},

const adminRoutes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children:
    [
      { path: 'dashboard', component: DashboardComponent },

      // { path: 'tasks', children:
      //   [
      //     { path: 'runners', component: RunnersTasksComponent },
      //   ]
      // },
      { path: 'map', children:
        [
          { path: 'runners', component: MapComponent},
        ]
      },
      { path: 'artists', component: ArtistsComponent},

      { path: 'calendar', component: CalendarComponent, children:
        [
          {path: 'edit', component: CalendarEditComponent},
          {path: 'day1', component: DayOneComponent},
        ]
      },
      { path: 'timetables', component: TimetablesComponent, children:
        [
          {path: 'day1', component: DayOneTimetableComponent }
        ]
      }
    ]
  },

  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(adminRoutes)
  ],
  exports: [RouterModule],
  declarations: []
})
export class AdminRoutingModule { }