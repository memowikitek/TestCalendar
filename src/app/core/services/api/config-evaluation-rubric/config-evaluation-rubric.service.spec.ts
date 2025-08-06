import { TestBed } from '@angular/core/testing';

import { ConfigEvaluationRubricService } from './config-evaluation-rubric.service';

describe('EvaluationRubricService', () => {
    let service: ConfigEvaluationRubricService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ConfigEvaluationRubricService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
