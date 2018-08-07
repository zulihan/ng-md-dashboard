import { environment } from '../environments/environment';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { LayoutModule } from '@angular/cdk/layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { JwtModule } from '@auth0/angular-jwt';

import { ToastrModule } from 'ngx-toastr';

// Firestore
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';

import { AuthService } from './auth/service/auth.service';
import { AuthGuard } from './auth/guard/auth.guard';
import { AlertifyService } from './_services/alertify.service';

import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { ErrorModule } from './views/errors/error.module';

import { JwtHelperService } from '@auth0/angular-jwt';
import { GeoService } from './_services/geo.service';

import { MaterialModule } from './material/material.module';
import { CalendarModule } from 'angular-calendar';
import { ErrorInterceptorProvider } from './_services/error.interceptor';
import { ArtistDetailResolver } from './_resolvers/artist-detail.resolver';
import { ArtistListResolver } from './_resolvers/artist-list.resolver';
import { ArtistsRegisterComponent } from './admin/artists/artists-register/artists-register.component';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule,
    ErrorModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AuthModule,
    AdminModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return localStorage.getItem('token');
        },
        whitelistedDomains: ['localhost:5000'],
        blacklistedRoutes: ['localhost:5000/api/auth']
      }
    }),
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
    MaterialModule,
    NgbModule.forRoot(),
    NgbModalModule.forRoot(),
    LayoutModule,
    CalendarModule.forRoot()
  ],
  providers: [
    AuthService,
    AuthGuard,
    AlertifyService,
    JwtHelperService,
    GeoService,
    ErrorInterceptorProvider,
    ArtistDetailResolver,
    ArtistListResolver
  ],
  bootstrap: [AppComponent],
  schemas: [ NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }
