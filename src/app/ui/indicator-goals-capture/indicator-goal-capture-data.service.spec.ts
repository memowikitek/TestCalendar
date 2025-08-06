import { TestBed } from '@angular/core/testing';

import { IndicatorGoalCaptureDataService } from './indicator-goal-capture-data.service';

describe('IndicatorGoalCaptureDataService', () => {
  let service: IndicatorGoalCaptureDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IndicatorGoalCaptureDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
