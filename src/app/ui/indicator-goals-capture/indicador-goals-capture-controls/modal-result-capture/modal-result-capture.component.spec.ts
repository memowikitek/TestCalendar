import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalResultCaptureComponent } from './modal-result-capture.component';

describe('ModalResultCaptureComponent', () => {
  let component: ModalResultCaptureComponent;
  let fixture: ComponentFixture<ModalResultCaptureComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalResultCaptureComponent]
    });
    fixture = TestBed.createComponent(ModalResultCaptureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
