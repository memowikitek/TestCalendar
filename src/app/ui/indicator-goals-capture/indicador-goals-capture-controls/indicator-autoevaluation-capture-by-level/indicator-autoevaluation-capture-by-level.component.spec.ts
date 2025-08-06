import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicatorAutoevaluationCaptureByLevelComponent } from './indicator-autoevaluation-capture-by-level.component';

describe('IndicatorAutoevaluationCaptureByLevelComponent', () => {
  let component: IndicatorAutoevaluationCaptureByLevelComponent;
  let fixture: ComponentFixture<IndicatorAutoevaluationCaptureByLevelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IndicatorAutoevaluationCaptureByLevelComponent]
    });
    fixture = TestBed.createComponent(IndicatorAutoevaluationCaptureByLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
