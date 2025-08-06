import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicatorResultCaptureComponent } from './indicator-result-capture.component';

describe('IndicatorResultCaptureComponent', () => {
  let component: IndicatorResultCaptureComponent;
  let fixture: ComponentFixture<IndicatorResultCaptureComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IndicatorResultCaptureComponent]
    });
    fixture = TestBed.createComponent(IndicatorResultCaptureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
