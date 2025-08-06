import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalUploadPmComponent } from './modal-upload-pm.component';

describe('ModalUploadPmComponent', () => {
  let component: ModalUploadPmComponent;
  let fixture: ComponentFixture<ModalUploadPmComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalUploadPmComponent]
    });
    fixture = TestBed.createComponent(ModalUploadPmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
