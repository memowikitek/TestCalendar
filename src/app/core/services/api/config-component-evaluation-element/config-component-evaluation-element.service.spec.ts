import { TestBed } from '@angular/core/testing';
import { ConfigComponentEvaluationElementService } from './config-component-evaluation-element.service';

describe('ConfigComponentEvaluationElementService', () => {
    let service: ConfigComponentEvaluationElementService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ConfigComponentEvaluationElementService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
