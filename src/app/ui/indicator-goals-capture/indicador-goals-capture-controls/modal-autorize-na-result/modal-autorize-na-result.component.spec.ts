import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAutorizeNaResultComponent } from './modal-autorize-na-result.component';

describe('ModalAutorizeNaResultComponent', () => {
  let component: ModalAutorizeNaResultComponent;
  let fixture: ComponentFixture<ModalAutorizeNaResultComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalAutorizeNaResultComponent]
    });
    fixture = TestBed.createComponent(ModalAutorizeNaResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
