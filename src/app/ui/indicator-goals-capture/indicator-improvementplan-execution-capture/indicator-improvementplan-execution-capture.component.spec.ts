import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicatorImprovementplanExecutionCaptureComponent } from './indicator-improvementplan-execution-capture.component';

describe('IndicatorImprovementplanExecutionCaptureComponent', () => {
  let component: IndicatorImprovementplanExecutionCaptureComponent;
  let fixture: ComponentFixture<IndicatorImprovementplanExecutionCaptureComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IndicatorImprovementplanExecutionCaptureComponent]
    });
    fixture = TestBed.createComponent(IndicatorImprovementplanExecutionCaptureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
