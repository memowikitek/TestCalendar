import { TestBed } from '@angular/core/testing';

import { CampusConfigService } from './campus-config.service';

describe('CampusConfigService', () => {
  let service: CampusConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CampusConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
