import { TestBed } from '@angular/core/testing';

import { ComponentMiRecordService } from './component-mi-record.service';

describe('ComponenteMiRecordService', () => {
    let service: ComponentMiRecordService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ComponentMiRecordService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
