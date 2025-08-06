import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicatorImprovementPlanDesignCaptureComponent } from './indicator-improvement-plan-design-capture.component';

describe('IndicatorImprovementPlanDesignCaptureComponent', () => {
  let component: IndicatorImprovementPlanDesignCaptureComponent;
  let fixture: ComponentFixture<IndicatorImprovementPlanDesignCaptureComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IndicatorImprovementPlanDesignCaptureComponent]
    });
    fixture = TestBed.createComponent(IndicatorImprovementPlanDesignCaptureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
