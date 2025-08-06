import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAutoevaluationCaptureComponent } from './modal-autoevaluation-capture.component';

describe('ModalAutoevaluationCaptureComponent', () => {
  let component: ModalAutoevaluationCaptureComponent;
  let fixture: ComponentFixture<ModalAutoevaluationCaptureComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalAutoevaluationCaptureComponent]
    });
    fixture = TestBed.createComponent(ModalAutoevaluationCaptureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
