/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DayTwoVenueThreeTimetableComponent } from './day-two-venue-three-timetable.component';

describe('DayTwoVenueThreeTimetableComponent', () => {
  let component: DayTwoVenueThreeTimetableComponent;
  let fixture: ComponentFixture<DayTwoVenueThreeTimetableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DayTwoVenueThreeTimetableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DayTwoVenueThreeTimetableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
