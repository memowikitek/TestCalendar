import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicatorImprovementPlanexecutionComponent } from './indicator-improvement-planexecution.component';

describe('IndicatorImprovementPlanexecutionComponent', () => {
  let component: IndicatorImprovementPlanexecutionComponent;
  let fixture: ComponentFixture<IndicatorImprovementPlanexecutionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IndicatorImprovementPlanexecutionComponent]
    });
    fixture = TestBed.createComponent(IndicatorImprovementPlanexecutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
