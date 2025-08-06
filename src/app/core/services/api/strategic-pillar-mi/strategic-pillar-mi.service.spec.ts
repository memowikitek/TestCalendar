import { TestBed } from '@angular/core/testing';

import { PilarEstrategicoMiService } from './strategic-pillar-mi.service';

describe('IndicatorMiService', () => {
    let service: PilarEstrategicoMiService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(PilarEstrategicoMiService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
