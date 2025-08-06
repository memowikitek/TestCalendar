import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAutorizeNaAutoevaluationComponent } from './modal-autorize-na-autoevaluation.component';

describe('ModalAutorizeNaAutoevaluationComponent', () => {
  let component: ModalAutorizeNaAutoevaluationComponent;
  let fixture: ComponentFixture<ModalAutorizeNaAutoevaluationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalAutorizeNaAutoevaluationComponent]
    });
    fixture = TestBed.createComponent(ModalAutorizeNaAutoevaluationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
