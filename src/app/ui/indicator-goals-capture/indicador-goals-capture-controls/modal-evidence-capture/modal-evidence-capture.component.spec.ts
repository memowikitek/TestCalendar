import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEvidenceCaptureComponent } from './modal-evidence-capture.component';

describe('ModalEvidenceCaptureComponent', () => {
  let component: ModalEvidenceCaptureComponent;
  let fixture: ComponentFixture<ModalEvidenceCaptureComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalEvidenceCaptureComponent]
    });
    fixture = TestBed.createComponent(ModalEvidenceCaptureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
