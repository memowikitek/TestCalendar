import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubIndicatorsMiComponent } from './sub-indicators-mi.component';

describe('SubIndicatorsMiComponent', () => {
    let component: SubIndicatorsMiComponent;
    let fixture: ComponentFixture<SubIndicatorsMiComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SubIndicatorsMiComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SubIndicatorsMiComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
