import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/guard/auth.guard';

import { DashboardComponent } from './dashboard/dashboard.component';
// import { NotFoundComponent } from '../views/errors/not-found/not-found.component';
import { AdminComponent } from './admin.component';
import { MapComponent } from './map/map/map.component';
// import { ArtistsListComponent } from './artists/artists-list/artists-list.component';
// import { ArtistsComponent } from './artists/artists.component';
import { CalendarComponent } from './calendar/calendar.component';
import { CalendarEditComponent } from './calendar/calendar-edit/calendar-edit.component';
import { DayOneComponent } from './calendar/day-one/day-one.component';
import { TimetablesComponent } from './timetables/timetables.component';
import { DayOneTimetableComponent } from './timetables/day-one-timetable/day-one-timetable.component';
import { DayTwoTimetableComponent } from 'src/app/admin/timetables/day-two-timetable/day-two-timetable.component';
import { UsersComponent } from './users/users.component';
import { ArtistDetailComponent } from './artists/artist-detail/artist-detail.component';
import { ArtistsListComponent } from './artists/artists-list/artists-list.component';
import { ArtistDetailResolver } from '../_resolvers/artist-detail.resolver';
import { ArtistListResolver } from '../_resolvers/artist-list.resolver';
import { ArtistEditComponent } from './artists/artist-edit/artist-edit.component';
import { UserEditComponent } from './users/user-edit/user-edit.component';
import { DayOneVenueOneTimetableComponent } from './timetables/day-one-venue-one-timetable/day-one-venue-one-timetable.component';
import { DayOneVenueTwoTimetableComponent } from './timetables/day-one-venue-two-timetable/day-one-venue-two-timetable.component';
import { DayOneVenueThreeTimetableComponent } from './timetables/day-one-venue-three-timetable/day-one-venue-three-timetable.component';
// import { TimetablesModule } from './timetables/timetables.module';
import { DayTwoVenueOneTimetableComponent } from './timetables/day-two-venue-one-timetable/day-two-venue-one-timetable.component';
import { DayTwoVenueTwoTimetableComponent } from './timetables/day-two-venue-two-timetable/day-two-venue-two-timetable.component';
import { DayTwoVenueThreeTimetableComponent } from './timetables/day-two-venue-three-timetable/day-two-venue-three-timetable.component';
import { ChecklistComponent } from './checklist/checklist.component';
import { TasksComponent } from 'src/app/admin/tasks/tasks.component';
import { TasksListComponent } from './tasks/tasks-list/tasks-list.component';
import { RunnersTasksTimetableComponent } from './timetables/runners-tasks-timetable/runners-tasks-timetable.component';

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
      { path: 'artists', component: ArtistsListComponent, resolve: {
        artistsInfos: ArtistListResolver }},
      {path: 'artists/:id', component: ArtistDetailComponent, resolve: {
        artist: ArtistDetailResolver
      }},
      {path: 'artists/edit', component: ArtistEditComponent },

      { path: 'users', component: UsersComponent },
      { path: 'user/edit/:id', component: UserEditComponent },

      { path: 'calendar', component: CalendarComponent, children:
        [
          {path: 'edit', component: CalendarEditComponent},
          {path: 'day1', component: DayOneComponent},
        ]
      },
      { path: 'timetables',
        component: TimetablesComponent,
        children:
        [
          {path: 'day-one', component: DayOneTimetableComponent},
          {path: 'day-one/venue-one', component: DayOneVenueOneTimetableComponent},
          {path: 'day-one/venue-two', component: DayOneVenueTwoTimetableComponent},
          {path: 'day-one/venue-three', component: DayOneVenueThreeTimetableComponent},
          {path: 'day-two', component: DayTwoTimetableComponent },
          {path: 'day-two/venue-one', component: DayTwoVenueOneTimetableComponent},
          {path: 'day-two/venue-two', component: DayTwoVenueTwoTimetableComponent},
          {path: 'day-two/venue-three', component: DayTwoVenueThreeTimetableComponent},
        ]
      },
      { path: 'checklist', component: ChecklistComponent},
      { path: 'tasks', component: TasksComponent, children:
        [
          {path: 'tasks-list', component: TasksListComponent},
          {path: 'runners-tasks-timetable', component: RunnersTasksTimetableComponent}
        ]
      },
      // { path: '**', component: NotFoundComponent }
    ]
  }

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
