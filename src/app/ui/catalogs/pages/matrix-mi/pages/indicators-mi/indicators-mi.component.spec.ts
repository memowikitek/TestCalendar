import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicatorsMiComponent } from './indicators-mi.component';

describe('IndicatorsMiComponent', () => {
    let component: IndicatorsMiComponent;
    let fixture: ComponentFixture<IndicatorsMiComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [IndicatorsMiComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(IndicatorsMiComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
