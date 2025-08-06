import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicatorResultCaptureByLevelComponent } from './indicator-result-capture-by-level.component';

describe('IndicatorResultCaptureByLevelComponent', () => {
  let component: IndicatorResultCaptureByLevelComponent;
  let fixture: ComponentFixture<IndicatorResultCaptureByLevelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IndicatorResultCaptureByLevelComponent]
    });
    fixture = TestBed.createComponent(IndicatorResultCaptureByLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
