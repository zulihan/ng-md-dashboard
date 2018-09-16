/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DayOneVenueTwoTimetableComponent } from './day-one-venue-two-timetable.component';

describe('DayOneVenueTwoTimetableComponent', () => {
  let component: DayOneVenueTwoTimetableComponent;
  let fixture: ComponentFixture<DayOneVenueTwoTimetableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DayOneVenueTwoTimetableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DayOneVenueTwoTimetableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
