import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicatorGoalsCaptureByIndicatorComponent } from './indicator-goals-capture-by-indicator.component';

describe('IndicatorGoalsCaptureByIndicatorComponent', () => {
  let component: IndicatorGoalsCaptureByIndicatorComponent;
  let fixture: ComponentFixture<IndicatorGoalsCaptureByIndicatorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IndicatorGoalsCaptureByIndicatorComponent]
    });
    fixture = TestBed.createComponent(IndicatorGoalsCaptureByIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
