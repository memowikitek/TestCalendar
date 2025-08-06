import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEvidenceAcceptComponent } from './modal-evidence-accept.component';

describe('ModalEvidenceAcceptComponent', () => {
  let component: ModalEvidenceAcceptComponent;
  let fixture: ComponentFixture<ModalEvidenceAcceptComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalEvidenceAcceptComponent]
    });
    fixture = TestBed.createComponent(ModalEvidenceAcceptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
