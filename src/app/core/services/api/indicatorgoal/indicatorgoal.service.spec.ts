import { TestBed } from '@angular/core/testing';

import { IndicatorgoalService } from './indicatorgoal.service';

describe('IndicatorgoalService', () => {
  let service: IndicatorgoalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IndicatorgoalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
