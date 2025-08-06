import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalConfirmationAutoreviewComponent } from './modal-confirmation-autoreview.component';

describe('ModalConfirmationAutoreviewComponent', () => {
  let component: ModalConfirmationAutoreviewComponent;
  let fixture: ComponentFixture<ModalConfirmationAutoreviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalConfirmationAutoreviewComponent]
    });
    fixture = TestBed.createComponent(ModalConfirmationAutoreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
