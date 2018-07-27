import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Day1CalendarComponent } from './day1-calendar.component';

describe('Day1CalendarComponent', () => {
  let component: Day1CalendarComponent;
  let fixture: ComponentFixture<Day1CalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Day1CalendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Day1CalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
