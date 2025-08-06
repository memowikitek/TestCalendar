/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ConfigElementsComponent } from './config-elements.component';

describe('ConfigurationElementsComponent', () => {
    let component: ConfigElementsComponent;
    let fixture: ComponentFixture<ConfigElementsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ConfigElementsComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ConfigElementsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
