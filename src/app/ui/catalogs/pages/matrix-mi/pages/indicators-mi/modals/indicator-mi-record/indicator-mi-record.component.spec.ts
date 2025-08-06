import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicatorMiRecordComponent } from './indicator-mi-record.component';

describe('IndicatorMiRecordComponent', () => {
    let component: IndicatorMiRecordComponent;
    let fixture: ComponentFixture<IndicatorMiRecordComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [IndicatorMiRecordComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(IndicatorMiRecordComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
