import { RouterModule, Route, PreloadAllModules } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AuthGuard } from './auth/guard/auth.guard';

//  import { NotFoundComponent } from './views/errors/not-found/not-found.component';
import { LoginComponent } from './auth/login/login.component';
import { DayOneTimetableComponent } from './admin/timetables/day-one-timetable/day-one-timetable.component';


const routes: Route[] = [
  { path: '', canActivate: [AuthGuard], redirectTo: 'admin', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'timetable', component: DayOneTimetableComponent },

  // { path: '**', component: NotFoundComponent }
];

@NgModule({
    imports: [
      CommonModule,
      RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
    ],
    exports: [RouterModule],
    declarations: []
  })
export class AppRoutingModule {}
