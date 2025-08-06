import { TestBed } from '@angular/core/testing';

import { IndicatorMiRecordService } from './indicator-mi-record.service';

describe('IndicatorMiRecordService', () => {
    let service: IndicatorMiRecordService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(IndicatorMiRecordService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
