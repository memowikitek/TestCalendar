import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentMiRecordComponent } from './component-mi-record.component';

describe('conponentMiRecordComponent', () => {
    let component: ComponentMiRecordComponent;
    let fixture: ComponentFixture<ComponentMiRecordComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ComponentMiRecordComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ComponentMiRecordComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
