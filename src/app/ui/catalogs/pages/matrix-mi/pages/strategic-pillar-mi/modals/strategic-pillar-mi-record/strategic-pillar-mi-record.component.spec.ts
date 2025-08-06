import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PilarEstrategicoMiRecordComponent } from './strategic-pillar-mi-record.component';

describe('conponentMiRecordComponent', () => {
    let component: PilarEstrategicoMiRecordComponent;
    let fixture: ComponentFixture<PilarEstrategicoMiRecordComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PilarEstrategicoMiRecordComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PilarEstrategicoMiRecordComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
