import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicatorImprovementplanExecutionComponent } from './indicator-improvementplan-execution.component';

describe('IndicatorImprovementplanExecutionComponent', () => {
  let component: IndicatorImprovementplanExecutionComponent;
  let fixture: ComponentFixture<IndicatorImprovementplanExecutionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IndicatorImprovementplanExecutionComponent]
    });
    fixture = TestBed.createComponent(IndicatorImprovementplanExecutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
