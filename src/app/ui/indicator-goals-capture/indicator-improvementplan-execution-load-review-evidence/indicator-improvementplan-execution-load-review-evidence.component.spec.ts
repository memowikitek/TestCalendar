import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicatorImprovementplanExecutionLoadReviewEvidenceComponent } from './indicator-improvementplan-execution-load-review-evidence.component';

describe('IndicatorImprovementplanExecutionLoadReviewEvidenceComponent', () => {
  let component: IndicatorImprovementplanExecutionLoadReviewEvidenceComponent;
  let fixture: ComponentFixture<IndicatorImprovementplanExecutionLoadReviewEvidenceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IndicatorImprovementplanExecutionLoadReviewEvidenceComponent]
    });
    fixture = TestBed.createComponent(IndicatorImprovementplanExecutionLoadReviewEvidenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
