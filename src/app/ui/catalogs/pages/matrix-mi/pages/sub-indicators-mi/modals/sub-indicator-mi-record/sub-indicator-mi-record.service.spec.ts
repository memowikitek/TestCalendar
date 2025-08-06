import { TestBed } from '@angular/core/testing';

import { SubIndicatorMiRecordService } from './sub-indicator-mi-record.service';

describe('SubIndicatorMiRecordService', () => {
    let service: SubIndicatorMiRecordService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SubIndicatorMiRecordService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
