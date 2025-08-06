import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalIndicatorCaptureComponent } from './modal-indicator-capture.component';

describe('ModalIndicatorCaptureComponent', () => {
  let component: ModalIndicatorCaptureComponent;
  let fixture: ComponentFixture<ModalIndicatorCaptureComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalIndicatorCaptureComponent]
    });
    fixture = TestBed.createComponent(ModalIndicatorCaptureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
