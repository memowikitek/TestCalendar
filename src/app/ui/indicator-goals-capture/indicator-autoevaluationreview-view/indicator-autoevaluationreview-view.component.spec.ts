import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicatorAutoevaluationreviewViewComponent } from './indicator-autoevaluationreview-view.component';

describe('IndicatorAutoevaluationreviewViewComponent', () => {
  let component: IndicatorAutoevaluationreviewViewComponent;
  let fixture: ComponentFixture<IndicatorAutoevaluationreviewViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IndicatorAutoevaluationreviewViewComponent]
    });
    fixture = TestBed.createComponent(IndicatorAutoevaluationreviewViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
