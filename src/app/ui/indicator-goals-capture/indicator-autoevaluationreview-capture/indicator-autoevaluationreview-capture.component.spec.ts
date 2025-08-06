import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicatorAutoevaluationreviewCaptureComponent } from './indicator-autoevaluationreview-capture.component';

describe('IndicatorAutoevaluationreviewCaptureComponent', () => {
  let component: IndicatorAutoevaluationreviewCaptureComponent;
  let fixture: ComponentFixture<IndicatorAutoevaluationreviewCaptureComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IndicatorAutoevaluationreviewCaptureComponent]
    });
    fixture = TestBed.createComponent(IndicatorAutoevaluationreviewCaptureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
