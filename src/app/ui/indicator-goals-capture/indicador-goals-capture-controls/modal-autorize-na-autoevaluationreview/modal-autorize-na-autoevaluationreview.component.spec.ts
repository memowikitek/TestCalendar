import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAutorizeNaAutoevaluationreviewComponent } from './modal-autorize-na-autoevaluationreview.component';

describe('ModalAutorizeNaAutoevaluationreviewComponent', () => {
  let component: ModalAutorizeNaAutoevaluationreviewComponent;
  let fixture: ComponentFixture<ModalAutorizeNaAutoevaluationreviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalAutorizeNaAutoevaluationreviewComponent]
    });
    fixture = TestBed.createComponent(ModalAutorizeNaAutoevaluationreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
