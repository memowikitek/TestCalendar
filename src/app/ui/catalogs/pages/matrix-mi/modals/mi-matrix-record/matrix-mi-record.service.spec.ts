import { TestBed } from '@angular/core/testing';

import { MatrixMiRecordService } from './matrix-mi-record.service';

describe('MatrixMiRecordService', () => {
    let service: MatrixMiRecordService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(MatrixMiRecordService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
