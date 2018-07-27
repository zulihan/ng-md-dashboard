import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { Timetable } from '../_timetable/timetable';
import { Renderer } from '../_timetable/renderer';
import { Scope } from '../_timetable/_models/scope';

@Component({
  selector: 'app-day-one-timetable',
  templateUrl: './day-one-timetable.component.html',
  styleUrls: ['./day-one-timetable.component.scss']
})
export class DayOneTimetableComponent implements OnInit {

  options = {
    url: '#', // makes the event clickable
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


  @ViewChild('timetable') element: ElementRef;
  selector;
  timetable: Timetable;
  renderer: Renderer;
  scope: Scope;
  locations = [];
  events = [];

  constructor() {
    this.timetable = new Timetable();
  }

  ngOnInit() {
    this.selector =  this.element.nativeElement;
    this.addTimeTable();
  }

  addTimeTable() {
    this.timetable.setScope(9, 9);

    this.timetable.addLocations(['London', 'Paris', 'Los Angeles']);

    this.timetable.addEvent('Sightseeing', 'London', new Date(2018, 8, 25, 11, 45), new Date(2018, 8, 25, 12, 45), this.options);
    this.timetable.addEvent('Sightseeing', 'London', new Date(2018, 8, 25, 13), new Date(2018, 8, 25, 15, 30), { url: '#' });

    this.timetable.addEvent('Zumba', 'Paris', new Date(2018, 8, 27, 9), new Date(2018, 8, 27, 10), { url: '#' });

    this.timetable.addEvent('Cocktails', 'Los Angeles', new Date(2018, 8, 22, 9), new Date(2018, 8, 22, 10), {  onClick: function(event) {
      window.alert('You clicked on the ' + event.name + ' event in ' + event.location + '. This is an example of a click handler');
    }} );

    this.renderer = new Renderer(this.timetable);
    this.renderer.draw(this.selector);
  }


}
