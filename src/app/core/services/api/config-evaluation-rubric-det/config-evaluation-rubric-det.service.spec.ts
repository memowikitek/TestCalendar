import { TestBed } from '@angular/core/testing';

import { ConfigEvaluationRubricDetailService } from './config-evaluation-rubric-det.service';

describe('ConfigEvaluationRubricDetailService', () => {
    let service: ConfigEvaluationRubricDetailService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ConfigEvaluationRubricDetailService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
