import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAutoevaluationreviewAjustCaptureComponent } from './modal-autoevaluationreview-ajust-capture.component';

describe('ModalAutoevaluationreviewAjustCaptureComponent', () => {
  let component: ModalAutoevaluationreviewAjustCaptureComponent;
  let fixture: ComponentFixture<ModalAutoevaluationreviewAjustCaptureComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalAutoevaluationreviewAjustCaptureComponent]
    });
    fixture = TestBed.createComponent(ModalAutoevaluationreviewAjustCaptureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
