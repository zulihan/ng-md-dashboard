import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { Timetable } from '../_timetable/timetable';
import { Renderer } from '../_timetable/renderer';
import { Scope } from '../_timetable/_models/scope';
import { TimetablesService } from '../_service/timetables.service';
import { ArtistsService } from '../../artists/service/artists.service';
import { Artist } from '../../../_models/artist';

@Component({
  selector: 'app-day-one-venue-two-timetable',
  templateUrl: './day-one-venue-two-timetable.component.html',
  styleUrls: ['./day-one-venue-two-timetable.component.scss']
})
export class DayOneVenueTwoTimetableComponent implements OnInit {

  @ViewChild('timetableOneVenueTwo') timetableDayOneVenueTwo: ElementRef;
  selector;
  timetable: Timetable;
  timeTableDayOneVenueTwo =
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
    data: { // each property will be added to the data-* attributes of the DOM node for this event
      id: 4,
      ticketType: 'VIP'
    },
    onClick: function(event) {
        window.alert('You clicked on the ' + event.name + ' event in ' + event.location + '. This is an example of a click handler');
      }
    // custom click handler, which is passed the event object and full timetable as context
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
    this.selector =  this.timetableDayOneVenueTwo.nativeElement;
    this.artistService.getArtistsByDayByVenue(1, 2)
      .subscribe(artists => {
        this.artists = artists;
        this.artists.forEach(a => {
          a.show.artist = a.name;
          a.getIn.artist = a.name;
          a.setUpWings.artist = a.name;
          a.soundCheck.artist = a.name;
          this.timeTableDayOneVenueTwo.shows.push(a.show);
          this.timeTableDayOneVenueTwo.getIns.push(a.getIn);
          this.timeTableDayOneVenueTwo.setUpWings.push(a.setUpWings);
          this.timeTableDayOneVenueTwo.soundChecks.push(a.soundCheck);
        });
        console.log(' DayOneVenueTwoTimetableComponent -> ngOnInit -> this.timeTableDayOneVenueTwo', this.timeTableDayOneVenueTwo);
        console.log(' DayOneVenueTwoTimetableComponent -> ngOnInit -> this.artists', this.artists);
        this.day = this.artists[0].dayId;
        this.venue = this.artists[0].venue;
        this.addTimeTable(this.timetable, this.selector, this.timeTableDayOneVenueTwo);
      });

  }

  setScopeTime(timeTable) {
    const getInsStart = [];

    timeTable.getIns.forEach(g => {
      if (g.start !== null && g.start !== undefined && g.start !== 0) {
        getInsStart.push(g.start);
      }
    });

    const getInsStartumber = getInsStart.map(gis => {
      return gis = Number(new Date(gis));
    });
    console.log(' DayOneVenueTwoTimetableComponent -> setScopeTime -> getInsStartumber', getInsStartumber);

    const earliestGetIn = getInsStartumber.reduce((a, b) => {
        return Math.min(a, b);
      });
    console.log(' DayOneVenueTwoTimetableComponent -> setScopeTime -> earliestGetIn', earliestGetIn);

    console.log(' DayOneVenueTwoTimetableComponent -> setScopeTime -> new Date(earliestGetIn).getHours()',
    new Date(earliestGetIn).getHours());

    return new Date(earliestGetIn).getHours();
  }

  addTimeTable(tt, selector, timeTable) {

    this.scopeTime = this.setScopeTime(timeTable);
    console.log(' DayOneVenueTwoTimetableComponent -> addTimeTable -> this.scopeTime', this.scopeTime);

    tt.setScope(this.scopeTime, this.scopeTime);

    const artists: string[] = [];

    this.artists.forEach(a => artists.push(a.name.toUpperCase()));
    tt.addArtists(artists);

    timeTable.getIns.forEach(g => {
      if (g.start && g.end !== (null || undefined || 0 )) {
        tt.addEvent('GI', g.artist.toUpperCase(), new Date(g.start), new Date(g.end), this.getInOptions);
        // console.log(' DayOneVenueTwoTimetableComponent -> addTimeTable -> getIns.forEach > g.start', g.start);
      }
    });

    timeTable.setUpWings.forEach(suw => {
      if (suw.start && suw.end !== null) {
        tt.addEvent('SUW', suw.artist.toUpperCase(), new Date(suw.start), new Date(suw.end), this.setUpWingsOptions);
        // console.log(' DayOneVenueTwoTimetableComponent -> addTimeTable -> setUpWings.forEach > suw.start', suw.start);
      }
    });

    timeTable.soundChecks.forEach(sc => {
      if (sc.start && sc.end !== null) {
        tt.addEvent('SC', sc.artist.toUpperCase(), new Date(sc.start), new Date(sc.end), this.soundChecksOptions);
        // console.log(' DayOneVenueTwoTimetableComponent -> addTimeTable -> soundChecks.forEach > sc.start', sc.start);
      }
    });

    timeTable.shows.forEach(s => {
      if (s.start && s.end !== null) {
        tt.addEvent('Show', s.artist.toUpperCase(), new Date(s.start), new Date(s.end), this.showsOptions);
        // console.log(' DayOneVenueTwoTimetableComponent -> addTimeTable -> shows.forEach > s.start', s.start);
      }
    });

    const renderer = new Renderer(tt);
    renderer.draw(selector);
    document.getElementById('time').scrollIntoView();
  }

}
