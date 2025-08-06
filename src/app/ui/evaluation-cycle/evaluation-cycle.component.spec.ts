import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluationCycleComponent } from './evaluation-cycle.component';

describe('EvaluationCycleComponent', () => {
  let component: EvaluationCycleComponent;
  let fixture: ComponentFixture<EvaluationCycleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EvaluationCycleComponent]
    });
    fixture = TestBed.createComponent(EvaluationCycleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
