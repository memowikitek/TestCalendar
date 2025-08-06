import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAutorizePmClmComponent } from './modal-autorize-pm-clm.component';

describe('ModalAutorizePmClmComponent', () => {
  let component: ModalAutorizePmClmComponent;
  let fixture: ComponentFixture<ModalAutorizePmClmComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalAutorizePmClmComponent]
    });
    fixture = TestBed.createComponent(ModalAutorizePmClmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
