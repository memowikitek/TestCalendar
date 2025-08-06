import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAutoevaluationreviewCaptureComponent } from './modal-autoevaluationreview-capture.component';

describe('ModalAutoevaluationreviewCaptureComponent', () => {
  let component: ModalAutoevaluationreviewCaptureComponent;
  let fixture: ComponentFixture<ModalAutoevaluationreviewCaptureComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalAutoevaluationreviewCaptureComponent]
    });
    fixture = TestBed.createComponent(ModalAutoevaluationreviewCaptureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
