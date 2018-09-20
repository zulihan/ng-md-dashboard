import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RunnerMapComponent } from './runner-map.component';

describe('RunnerMapComponent', () => {
  let component: RunnerMapComponent;
  let fixture: ComponentFixture<RunnerMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RunnerMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RunnerMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
