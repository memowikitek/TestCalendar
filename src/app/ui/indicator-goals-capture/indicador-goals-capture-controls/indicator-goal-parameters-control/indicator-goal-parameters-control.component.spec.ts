import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicatorGoalParametersControlComponent } from './indicator-goal-parameters-control.component';

describe('IndicatorGoalParametersControlComponent', () => {
  let component: IndicatorGoalParametersControlComponent;
  let fixture: ComponentFixture<IndicatorGoalParametersControlComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IndicatorGoalParametersControlComponent]
    });
    fixture = TestBed.createComponent(IndicatorGoalParametersControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
