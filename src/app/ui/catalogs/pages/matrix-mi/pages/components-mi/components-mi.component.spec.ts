import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentsMiComponent } from './components-mi.component';

describe('ComponentsMiComponent', () => {
    let component: ComponentsMiComponent;
    let fixture: ComponentFixture<ComponentsMiComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ComponentsMiComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ComponentsMiComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
