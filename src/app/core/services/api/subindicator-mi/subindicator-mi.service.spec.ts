import { TestBed } from '@angular/core/testing';

import { SubindicatorMiService } from './subindicator-mi.service';

describe('SubindicatorMiService', () => {
    let service: SubindicatorMiService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SubindicatorMiService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
