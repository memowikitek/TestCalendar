import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RubricaAutoevaluacionAjusteComponent } from './rubrica-autoevaluacion-ajuste.component';

describe('RubricaAutoevaluacionAjusteComponent', () => {
  let component: RubricaAutoevaluacionAjusteComponent;
  let fixture: ComponentFixture<RubricaAutoevaluacionAjusteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RubricaAutoevaluacionAjusteComponent]
    });
    fixture = TestBed.createComponent(RubricaAutoevaluacionAjusteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
