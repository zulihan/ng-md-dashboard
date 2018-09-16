/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DayOneVenueOneTimetableComponent } from './day-one-venue-one-timetable.component';

describe('DayOneVenueOneTimetableComponent', () => {
  let component: DayOneVenueOneTimetableComponent;
  let fixture: ComponentFixture<DayOneVenueOneTimetableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DayOneVenueOneTimetableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DayOneVenueOneTimetableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
