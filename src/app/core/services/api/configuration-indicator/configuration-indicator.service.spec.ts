import { TestBed } from '@angular/core/testing';

import { ConfigurationIndicatorService } from './configuration-indicator.service';

describe('ConfigurationIndicatorService', () => {
    let service: ConfigurationIndicatorService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ConfigurationIndicatorService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
