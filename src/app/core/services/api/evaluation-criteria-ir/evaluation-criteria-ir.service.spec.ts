import { TestBed } from '@angular/core/testing';

import { EvaluationCriteriaIrService } from './evaluation-criteria-ir.service';

describe('EvaluationCriteriaIrService', () => {
  let service: EvaluationCriteriaIrService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EvaluationCriteriaIrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
