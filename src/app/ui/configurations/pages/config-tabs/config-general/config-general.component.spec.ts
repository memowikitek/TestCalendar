/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ConfigGeneralComponent } from './config-general.component';

describe('ConfigurationGeneralComponent', () => {
    let component: ConfigGeneralComponent;
    let fixture: ComponentFixture<ConfigGeneralComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ConfigGeneralComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ConfigGeneralComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
