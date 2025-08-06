import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalImprovementPlanexecutionComponent } from './modal-improvement-planexecution.component';

describe('ModalImprovementPlanexecutionComponent', () => {
  let component: ModalImprovementPlanexecutionComponent;
  let fixture: ComponentFixture<ModalImprovementPlanexecutionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalImprovementPlanexecutionComponent]
    });
    fixture = TestBed.createComponent(ModalImprovementPlanexecutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
