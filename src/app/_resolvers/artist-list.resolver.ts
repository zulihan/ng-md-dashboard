import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Artist } from '../_models/artist';
import { ArtistsService } from '../admin/artists/service/artists.service';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';


@Injectable()
export class ArtistListResolver implements Resolve<Artist[]> {

    constructor(
        private artistsService: ArtistsService,
        private router: Router,
        private toastr: ToastrService) {}

    resolve(): Observable<Artist[]> {
        return this.artistsService.getArtists().pipe(
            catchError(error => {
                this.toastr.error('Problem retrieving the data');
                this.router.navigate(['/admin']);
                return of(null);
            })
        );
    }

}
