import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FileUploadModule } from 'ng2-file-upload';

import { AdminRoutingModule } from './admin-routing.module';

import { AgmCoreModule } from '@agm/core';

import { MaterialModule } from '../material/material.module';
import {FlexLayoutModule} from '@angular/flex-layout';


// main layout
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MainNavComponent } from './main-nav/main-nav.component';
import { MapComponent } from '../map/map/map.component';

import { environment } from '../../environments/environment';

import { ArtistsModule } from './artists/artists.module';

import { ArtistsService } from './artists/service/artists.service';
import { CalModule } from './calendar/calendar.module';
// import { Day1CalendarComponent } from 'src/app/admin/calendar/day1-calendar/day1-calendar.component';
import { TimetablesModule } from './timetables/timetables.module';
import { UsersComponent } from './users/users.component';
import { AuthModule } from '../auth/auth.module';
import { PipesModule } from './pipes/pipes.module';
import { UsersListComponent } from './users/users-list/users-list.component';
import { UserEditComponent } from './users/user-edit/user-edit.component';
import { ArtistsRegisterComponent } from './artists/artists-register/artists-register.component';
import { PhotoEditorComponent } from './users/photo-editor/photo-editor.component';


@NgModule({
  declarations: [
    AdminComponent,
    DashboardComponent,
    MainNavComponent,
    MapComponent,
    UsersComponent,
    UsersListComponent,
    UserEditComponent,
    PhotoEditorComponent
  ],
  entryComponents: [ArtistsRegisterComponent],
  imports: [
    CommonModule,
    RouterModule,
    AdminRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    AgmCoreModule.forRoot({
      apiKey: environment.googleMapsKey
    }),
    ArtistsModule,
    CalModule,
    TimetablesModule,
    AuthModule,
    FormsModule,
    ReactiveFormsModule,
    PipesModule,
    FileUploadModule
  ],
  exports: [
    AdminComponent,
    DashboardComponent,
    MapComponent,
  ],
  providers: [ArtistsService]
})
export class AdminModule {}
