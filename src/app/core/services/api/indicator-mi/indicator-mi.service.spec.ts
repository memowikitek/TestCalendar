import { TestBed } from '@angular/core/testing';

import { IndicatorMiService } from './indicator-mi.service';

describe('IndicatorMiService', () => {
    let service: IndicatorMiService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(IndicatorMiService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
