import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRevisorComponent } from './modal-revisor.component';

describe('ModalRevisorComponent', () => {
  let component: ModalRevisorComponent;
  let fixture: ComponentFixture<ModalRevisorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalRevisorComponent]
    });
    fixture = TestBed.createComponent(ModalRevisorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
