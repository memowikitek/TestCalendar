import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RubricaAutoevaluacionComponent } from './rubrica-autoevaluacion.component';

describe('RubricaAutoevaluacionComponent', () => {
  let component: RubricaAutoevaluacionComponent;
  let fixture: ComponentFixture<RubricaAutoevaluacionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RubricaAutoevaluacionComponent]
    });
    fixture = TestBed.createComponent(RubricaAutoevaluacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
