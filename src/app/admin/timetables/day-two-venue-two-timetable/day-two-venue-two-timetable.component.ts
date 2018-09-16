import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { Timetable } from '../_timetable/timetable';
import { Renderer } from '../_timetable/renderer';
import { Scope } from '../_timetable/_models/scope';
import { TimetablesService } from '../_service/timetables.service';
import { ArtistsService } from '../../artists/service/artists.service';
import { Artist } from '../../../_models/artist';

@Component({
  selector: 'app-day-two-venue-two-timetable',
  templateUrl: './day-two-venue-two-timetable.component.html',
  styleUrls: ['./day-two-venue-two-timetable.component.scss']
})
export class DayTwoVenueTwoTimetableComponent implements OnInit {

  @ViewChild('timetableTwoVenueTwo') timetableDayTwoVenueTwo: ElementRef;
  selector;
  timetable: Timetable;
  timeTableDayTwoVenueTwo =
    {
      getIns: [],
      shows: [],
      setUpWings: [],
      soundChecks: []
    }
  ;

  scope: Scope;
  scopeTime: number;

  dateNow = new Date();
  timeNow = +(this.dateNow.getHours() + (this.dateNow.getMinutes() / 60)).toFixed(2);

  artists: Artist[];
  venue: string;
  day: number;

  getInOptions = {
    url: '', // makes the event clickable
    class: 'getin', // additional css class
};

  setUpWingsOptions = {
    url: '',
    class: 'setupwings',
  };

  soundChecksOptions = {
    url: '',
    class: 'soundcheck',
  };

  showsOptions = {
    url: '',
    class: 'show',
  };

  constructor(private timeTableService: TimetablesService, private artistService: ArtistsService) {
    this.timetable = new Timetable();
  }

  ngOnInit() {
    this.selector =  this.timetableDayTwoVenueTwo.nativeElement;
    this.artistService.getArtistsByDayByVenue(2, 2)
      .subscribe(artists => {
        this.artists = artists;
        this.artists.forEach(a => a.show.artist = a.name);
        this.artists.forEach(a => a.getIn.artist = a.name);
        this.artists.forEach(a => a.setUpWings.artist = a.name);
        this.artists.forEach(a => a.soundCheck.artist = a.name);
        this.artists.forEach(a => this.timeTableDayTwoVenueTwo.shows.push(a.show));
        this.artists.forEach(a => this.timeTableDayTwoVenueTwo.getIns.push(a.getIn));
        this.artists.forEach(a => this.timeTableDayTwoVenueTwo.setUpWings.push(a.setUpWings));
        this.artists.forEach(a => this.timeTableDayTwoVenueTwo.soundChecks.push(a.soundCheck));
        console.log('artists from dayOneVenueOne', this.artists);
        console.log('this.timeTableDayOneVenueOne', this.timeTableDayTwoVenueTwo);
        this.day = this.artists[0].dayId;
        this.venue = this.artists[0].venue;
        this.addTimeTable(this.timetable, this.selector, this.timeTableDayTwoVenueTwo);
      });

  }

  setScopeTime(timeTable) {
    const getInsStart = [];

    timeTable.getIns.forEach(g => {
      getInsStart.push(g.start);
    });

    const getInsStartumber = getInsStart.map(gis => {
      return gis = Number(new Date(gis));
    });

    const earliestGetIn = getInsStartumber.reduce((a, b) => {
        return Math.min(a, b);
      });

    return new Date(earliestGetIn).getHours();

  }

  addTimeTable(tt, selector, timeTable) {

    this.scopeTime = this.setScopeTime(timeTable);
    console.log('scopTime: ', this.scopeTime);

    tt.setScope(this.scopeTime, this.scopeTime);

    const artists: string[] = [];

    this.artists.forEach(a => artists.push(a.name.toUpperCase()));
    tt.addArtists(artists);

    timeTable.getIns.forEach(g => {
      if (g.start && g.end !== null) {
        tt.addEvent('GI', g.artist.toUpperCase(), new Date(g.start), new Date(g.end), this.getInOptions);
        console.log('g.start from forEach', g.start);
      }
    });

    timeTable.setUpWings.forEach(suw => {
      if (suw.start && suw.end !== null) {
        tt.addEvent('SUW', suw.artist.toUpperCase(), new Date(suw.start), new Date(suw.end), this.setUpWingsOptions);
        console.log('g.start from forEach', suw.start);
      }
    });

    timeTable.soundChecks.forEach(sc => {
      if (sc.start && sc.end !== null) {
        tt.addEvent('SC', sc.artist.toUpperCase(), new Date(sc.start), new Date(sc.end), this.soundChecksOptions);
        console.log('sc.start from forEach', sc.start);
      }
    });

    timeTable.shows.forEach(s => {
      if (s.start && s.end !== null) {
        tt.addEvent('Show', s.artist.toUpperCase(), new Date(s.start), new Date(s.end), this.showsOptions);
        console.log('s.start from forEach', s.start);
      }
    });

    const renderer = new Renderer(tt);
    renderer.draw(selector);
    document.getElementById('time').scrollIntoView();
  }

}
