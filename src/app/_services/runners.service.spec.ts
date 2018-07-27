/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RunnersService } from './runners.service';

describe('Service: Runners', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RunnersService]
    });
  });

  it('should ...', inject([RunnersService], (service: RunnersService) => {
    expect(service).toBeTruthy();
  }));
});
