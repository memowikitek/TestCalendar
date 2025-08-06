/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ModalIndicatorResultsComponent } from './modal-indicator-results.component';

describe('ModalIndicatorResultsComponent', () => {
    let component: ModalIndicatorResultsComponent;
    let fixture: ComponentFixture<ModalIndicatorResultsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ModalIndicatorResultsComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ModalIndicatorResultsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
