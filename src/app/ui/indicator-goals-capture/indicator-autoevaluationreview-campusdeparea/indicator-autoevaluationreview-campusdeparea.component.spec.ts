import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicatorAutoevaluationreviewCampusdepareaComponent } from './indicator-autoevaluationreview-campusdeparea.component';

describe('IndicatorAutoevaluationreviewCampusdepareaComponent', () => {
  let component: IndicatorAutoevaluationreviewCampusdepareaComponent;
  let fixture: ComponentFixture<IndicatorAutoevaluationreviewCampusdepareaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IndicatorAutoevaluationreviewCampusdepareaComponent]
    });
    fixture = TestBed.createComponent(IndicatorAutoevaluationreviewCampusdepareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
