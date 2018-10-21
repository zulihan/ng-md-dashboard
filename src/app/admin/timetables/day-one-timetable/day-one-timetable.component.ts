import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { Timetable } from '../_timetable/timetable';
import { Renderer } from '../_timetable/renderer';
import { Scope } from '../_timetable/_models/scope';
import { TimetablesService } from '../_service/timetables.service';
import { ArtistsService } from '../../artists/service/artists.service';
import { Artist } from '../../../_models/artist';

@Component({
  selector: 'app-day-one-timetable',
  templateUrl: './day-one-timetable.component.html',
  styleUrls: ['./day-one-timetable.component.scss']
})
export class DayOneTimetableComponent implements OnInit {

  @ViewChild('timetableOne') timetableDayOne: ElementRef;
  selector;
  timetable: Timetable;
  timeTableDayOne: any;

  scope: Scope;
  scopeTime: number;

  dateNow = new Date();
  timeNow = +(this.dateNow.getHours() + (this.dateNow.getMinutes() / 60)).toFixed(2);

  artists: Artist[];
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
    this.selector =  this.timetableDayOne.nativeElement;
    this.artistService.getArtistsByDay(1)
      .subscribe(artists => {
        this.artists = artists;
        this.day = artists[0].dayId;
        return this.artists;
      });

    this.timeTableService.getTimeTableByDay(1)
      .subscribe(response => {
        this.timeTableDayOne = response;
        this.addTimeTable(this.timetable, this.selector, this.timeTableDayOne);
        console.log(' DayOneTimetableComponent -> ngOnInit -> this.timeTableDayOne', this.timeTableDayOne);
      }, error => {
        console.log(' DayOneTimetableComponent -> ngOnInit -> error', error);
      });

  }

  setScopeTime(timeTable) {
    const getInsStart = [];

    timeTable.getIns.value.forEach(g => {
      if (g.start !== null && g.start !== undefined && g.start !== 0 ) {
        getInsStart.push(g.start);
      }
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
    const artists: string[] = [];
    this.scopeTime = this.setScopeTime(timeTable);
    console.log(' DayOneTimetableComponent -> addTimeTable -> this.scopeTime', this.scopeTime);

    tt.setScope(this.scopeTime, this.scopeTime);

    console.log(' DayOneTimetableComponent -> addTimeTable -> timeTable', timeTable);
    console.log(' DayOneTimetableComponent -> addTimeTable -> artists', artists);
    console.log(' DayOneTimetableComponent -> addTimeTable -> this.artists', this.artists);

    this.artists.forEach(a => artists.push(a.name.toUpperCase()));
    tt.addArtists(artists);

    timeTable.getIns.value.forEach(g => {
      if (g.start && g.end !== (null || undefined || 0 )) {
        tt.addEvent('GI', g.artist.toUpperCase(), new Date(g.start), new Date(g.end), this.getInOptions);
        // console.log('g.start from forEach', g.start);
      }
    });

    timeTable.setUpWings.value.forEach(suw => {
      if (suw.start && suw.end !== null) {
        tt.addEvent('SUW', suw.artist.toUpperCase(), new Date(suw.start), new Date(suw.end), this.setUpWingsOptions);
        // console.log('g.start from forEach', suw.start);
      }
    });

    timeTable.soundChecks.value.forEach(sc => {
      if (sc.start && sc.end !== null) {
        tt.addEvent('SC', sc.artist.toUpperCase(), new Date(sc.start), new Date(sc.end), this.soundChecksOptions);
        // console.log('sc.start from forEach', sc.start);
      }
    });

    timeTable.shows.value.forEach(s => {
      if (s.start && s.end !== null) {
        tt.addEvent('Show', s.artist.toUpperCase(), new Date(s.start), new Date(s.end), this.showsOptions);
        // console.log('s.start from forEach', s.start);
      }
    });

    const renderer = new Renderer(tt);
    renderer.draw(selector);
    console.log(' DayOneTimetableComponent -> addTimeTable -> this.timeNow', this.timeNow);
    document.getElementById('time').scrollIntoView({behavior: 'instant', block: 'center', inline: 'nearest'});
  }

}
