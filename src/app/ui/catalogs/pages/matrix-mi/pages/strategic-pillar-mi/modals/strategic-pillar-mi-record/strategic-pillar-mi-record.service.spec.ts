import { TestBed } from '@angular/core/testing';

import { PilarEstrategicoMiRecordService } from './strategic-pillar-mi-record.service';

describe('PilarEstrategicoMIRecordService', () => {
    let service: PilarEstrategicoMiRecordService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(PilarEstrategicoMiRecordService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
