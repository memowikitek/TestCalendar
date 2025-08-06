import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAutorizeNaEvidenceComponent } from './modal-autorize-na-evidence.component';

describe('ModalAutorizeNaEvidenceComponent', () => {
  let component: ModalAutorizeNaEvidenceComponent;
  let fixture: ComponentFixture<ModalAutorizeNaEvidenceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalAutorizeNaEvidenceComponent]
    });
    fixture = TestBed.createComponent(ModalAutorizeNaEvidenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
