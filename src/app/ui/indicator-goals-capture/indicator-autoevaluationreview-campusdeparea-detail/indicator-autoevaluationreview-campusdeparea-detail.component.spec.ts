import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicatorAutoevaluationreviewCampusdepareaDetailComponent } from './indicator-autoevaluationreview-campusdeparea-detail.component';

describe('IndicatorAutoevaluationreviewCampusdepareaDetailComponent', () => {
  let component: IndicatorAutoevaluationreviewCampusdepareaDetailComponent;
  let fixture: ComponentFixture<IndicatorAutoevaluationreviewCampusdepareaDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IndicatorAutoevaluationreviewCampusdepareaDetailComponent]
    });
    fixture = TestBed.createComponent(IndicatorAutoevaluationreviewCampusdepareaDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
