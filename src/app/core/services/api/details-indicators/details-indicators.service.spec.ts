import { TestBed } from '@angular/core/testing';

import { DetailsIndicatorsService } from './details-indicators.service';

describe('DetailsIndicatorsService', () => {
  let service: DetailsIndicatorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetailsIndicatorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
