import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatrixMiComponent } from './matrix-mi.component';

describe('UvmMatrixComponent', () => {
    let component: MatrixMiComponent;
    let fixture: ComponentFixture<MatrixMiComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MatrixMiComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(MatrixMiComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
