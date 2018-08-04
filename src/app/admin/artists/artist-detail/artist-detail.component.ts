import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Artist } from '../../../_models/artist';
import { ObservableMedia } from '@angular/flex-layout';
import { ArtistsService } from '../service/artists.service';
import { ToastrService } from 'ngx-toastr';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/takeWhile';
import 'rxjs/add/operator/startWith';


@Component({
  selector: 'app-artist-detail',
  templateUrl: './artist-detail.component.html',
  styleUrls: ['./artist-detail.component.scss']
})
export class ArtistDetailComponent implements OnInit {

  artist: Artist;

  cols;
  rowHeight;

  constructor(
    private artistsService: ArtistsService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private observableMedia: ObservableMedia) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.artist = data['artist'];
    });

    const grid = new Map([
      ['xs', 1],
      ['sm', 1],
      ['md', 2],
      ['lg', 3],
      ['xl', 3]
    ]);

    let start: number;

    grid.forEach((cols, mqAlias) => {
      if (this.observableMedia.isActive(mqAlias)) {
        start = cols;
      }
    });

    // on breakpoint, assign cols AND ROW HEIGHT appropriately
    this.cols = this.observableMedia.asObservable()
      .map(change => {

        this.rowHeight = this.heightToCols(grid.get(change.mqAlias));
        // console.log(this.rowHeight);

        return grid.get(change.mqAlias);

      })
      .startWith(start);
  }

  heightToCols(cols: number): number {
    if (cols === 1) {
      return 450;
    } else if (cols === 2) {
      return 450;
    } else {
      return 500;
    }

  }

  // loadArtist() {
  //   this.artistsService.getArtist(+this.route.snapshot.params['id'])
  //     .subscribe( (artist: Artist) => {
  //       this.artist = artist;
  //     }, error => {
  //       this.toastr.error(error);
  //     }
  //   );
  // }

}
