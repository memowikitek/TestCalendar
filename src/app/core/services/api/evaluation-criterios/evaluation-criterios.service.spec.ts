import { TestBed } from '@angular/core/testing';

import { EvaluationCriteriosService } from './evaluation-criterios.service';

describe('EvaluationCriteriosService', () => {
  let service: EvaluationCriteriosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EvaluationCriteriosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
