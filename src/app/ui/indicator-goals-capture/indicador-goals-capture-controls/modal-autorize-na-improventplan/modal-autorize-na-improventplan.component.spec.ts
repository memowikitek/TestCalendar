import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAutorizeNaImproventplanComponent } from './modal-autorize-na-improventplan.component';

describe('ModalAutorizeNaImproventplanComponent', () => {
  let component: ModalAutorizeNaImproventplanComponent;
  let fixture: ComponentFixture<ModalAutorizeNaImproventplanComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalAutorizeNaImproventplanComponent]
    });
    fixture = TestBed.createComponent(ModalAutorizeNaImproventplanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
