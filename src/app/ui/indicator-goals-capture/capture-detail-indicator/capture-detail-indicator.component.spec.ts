import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaptureDetailIndicatorComponent } from './capture-detail-indicator.component';

describe('CaptureDetailIndicatorComponent', () => {
  let component: CaptureDetailIndicatorComponent;
  let fixture: ComponentFixture<CaptureDetailIndicatorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CaptureDetailIndicatorComponent]
    });
    fixture = TestBed.createComponent(CaptureDetailIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
