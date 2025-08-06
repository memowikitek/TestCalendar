import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAutorizeNaIndicatorComponent } from './modal-autorize-na-indicator.component';

describe('ModalAutorizeNaIndicatorComponent', () => {
  let component: ModalAutorizeNaIndicatorComponent;
  let fixture: ComponentFixture<ModalAutorizeNaIndicatorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalAutorizeNaIndicatorComponent]
    });
    fixture = TestBed.createComponent(ModalAutorizeNaIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
