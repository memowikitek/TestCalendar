import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalImprovementplanDecisionCaptureComponent } from './modal-improvementplan-decision-capture.component';

describe('ModalImprovementplanDecisionCaptureComponent', () => {
  let component: ModalImprovementplanDecisionCaptureComponent;
  let fixture: ComponentFixture<ModalImprovementplanDecisionCaptureComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalImprovementplanDecisionCaptureComponent]
    });
    fixture = TestBed.createComponent(ModalImprovementplanDecisionCaptureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
