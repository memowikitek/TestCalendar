import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluationCriteriaIrComponent } from './evaluation-criteria-ir.component';

describe('EvaluationCriteriaIrComponent', () => {
  let component: EvaluationCriteriaIrComponent;
  let fixture: ComponentFixture<EvaluationCriteriaIrComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EvaluationCriteriaIrComponent]
    });
    fixture = TestBed.createComponent(EvaluationCriteriaIrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
