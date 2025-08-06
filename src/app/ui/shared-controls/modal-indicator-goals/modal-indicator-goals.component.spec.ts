/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { ModalIndicatorGoalsComponent } from './modal-indicator-goals.component';

describe('ModalIndicatorGoalsComponent', () => {
    let component: ModalIndicatorGoalsComponent;
    let fixture: ComponentFixture<ModalIndicatorGoalsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ModalIndicatorGoalsComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ModalIndicatorGoalsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
