import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicatorGoalsCaptureEvidenceLoadComponent } from './indicator-goals-capture-evidence-load.component';

describe('IndicatorGoalsCaptureEvidenceLoadComponent', () => {
  let component: IndicatorGoalsCaptureEvidenceLoadComponent;
  let fixture: ComponentFixture<IndicatorGoalsCaptureEvidenceLoadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IndicatorGoalsCaptureEvidenceLoadComponent]
    });
    fixture = TestBed.createComponent(IndicatorGoalsCaptureEvidenceLoadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
