import { TestBed } from '@angular/core/testing';

import { levelService } from './level.service';

describe('levelService', () => {
  let service: levelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(levelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
