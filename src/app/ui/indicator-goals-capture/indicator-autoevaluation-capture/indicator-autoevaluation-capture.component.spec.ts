import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicatorAutoevaluationCaptureComponent } from './indicator-autoevaluation-capture.component';

describe('IndicatorAutoevaluationCaptureComponent', () => {
  let component: IndicatorAutoevaluationCaptureComponent;
  let fixture: ComponentFixture<IndicatorAutoevaluationCaptureComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IndicatorAutoevaluationCaptureComponent]
    });
    fixture = TestBed.createComponent(IndicatorAutoevaluationCaptureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
