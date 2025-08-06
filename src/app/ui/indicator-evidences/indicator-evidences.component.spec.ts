/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { IndicatorEvidencesComponent } from './indicator-evidences.component';

describe('IndicatorEvidencesComponent', () => {
    let component: IndicatorEvidencesComponent;
    let fixture: ComponentFixture<IndicatorEvidencesComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [IndicatorEvidencesComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(IndicatorEvidencesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
