import { TestBed } from '@angular/core/testing';

import { ComponentMiService } from './component-mi.service';

describe('ComponentUvmService', () => {
    let service: ComponentMiService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ComponentMiService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
