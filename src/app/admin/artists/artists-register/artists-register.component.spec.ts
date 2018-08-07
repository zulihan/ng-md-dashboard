import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtistsRegisterComponent } from './artists-register.component';

describe('ArtistsRegisterComponent', () => {
  let component: ArtistsRegisterComponent;
  let fixture: ComponentFixture<ArtistsRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArtistsRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtistsRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
