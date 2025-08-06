import { TestBed } from '@angular/core/testing';
import { MatrixMiService } from './matrix-mi.service';

describe('MatrixMIService', () => {
    let service: MatrixMiService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(MatrixMiService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
