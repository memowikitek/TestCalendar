import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatrixMiRecordComponent } from './matrix-mi-record.component';

describe('MatrixMiRecordComponent', () => {
    let component: MatrixMiRecordComponent;
    let fixture: ComponentFixture<MatrixMiRecordComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MatrixMiRecordComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(MatrixMiRecordComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
