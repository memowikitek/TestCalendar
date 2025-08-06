import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicatorGoalsCaptureComponent } from './indicator-goals-capture.component';

describe('IndicatorGoalsCaptureComponent', () => {
  let component: IndicatorGoalsCaptureComponent;
  let fixture: ComponentFixture<IndicatorGoalsCaptureComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IndicatorGoalsCaptureComponent]
    });
    fixture = TestBed.createComponent(IndicatorGoalsCaptureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
