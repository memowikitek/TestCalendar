import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicatorGoalCaptureAutoevaluationreviewComponent } from './indicator-goal-capture-autoevaluationreview.component';

describe('IndicatorGoalCaptureAutoevaluationreviewComponent', () => {
  let component: IndicatorGoalCaptureAutoevaluationreviewComponent;
  let fixture: ComponentFixture<IndicatorGoalCaptureAutoevaluationreviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IndicatorGoalCaptureAutoevaluationreviewComponent]
    });
    fixture = TestBed.createComponent(IndicatorGoalCaptureAutoevaluationreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
