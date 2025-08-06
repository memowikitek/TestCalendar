import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicatorImprovementplanTakeDecisionComponent } from './indicator-improvementplan-take-decision.component';

describe('IndicatorImprovementplanTakeDecisionComponent', () => {
  let component: IndicatorImprovementplanTakeDecisionComponent;
  let fixture: ComponentFixture<IndicatorImprovementplanTakeDecisionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IndicatorImprovementplanTakeDecisionComponent]
    });
    fixture = TestBed.createComponent(IndicatorImprovementplanTakeDecisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
