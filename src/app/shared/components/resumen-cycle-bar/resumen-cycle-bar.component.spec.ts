import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumenCycleBarComponent } from './resumen-cycle-bar.component';

describe('ResumenCycleBarComponent', () => {
  let component: ResumenCycleBarComponent;
  let fixture: ComponentFixture<ResumenCycleBarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResumenCycleBarComponent]
    });
    fixture = TestBed.createComponent(ResumenCycleBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
