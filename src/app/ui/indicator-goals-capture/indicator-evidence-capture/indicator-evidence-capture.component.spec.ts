import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicatorEvidenceCaptureComponent } from './indicator-evidence-capture.component';

describe('IndicatorEvidenceCaptureComponent', () => {
  let component: IndicatorEvidenceCaptureComponent;
  let fixture: ComponentFixture<IndicatorEvidenceCaptureComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IndicatorEvidenceCaptureComponent]
    });
    fixture = TestBed.createComponent(IndicatorEvidenceCaptureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
