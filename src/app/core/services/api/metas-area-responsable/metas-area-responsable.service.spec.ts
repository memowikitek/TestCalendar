import { TestBed } from '@angular/core/testing';

import { MetasAreaResponsableService } from './metas-area-responsable.service';

describe('MetasAreaResponsableService', () => {
  let service: MetasAreaResponsableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MetasAreaResponsableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
