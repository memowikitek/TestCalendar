import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluationGenerationComponent } from './evaluation-generation.component';

describe('DetailsIndicatorComponent', () => {
  let component: EvaluationGenerationComponent;
  let fixture: ComponentFixture<EvaluationGenerationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvaluationGenerationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluationGenerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
