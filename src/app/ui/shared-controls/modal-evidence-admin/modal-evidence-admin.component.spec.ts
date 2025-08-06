import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEvidenceAdminComponent } from './modal-evidence-admin.component';

describe('ModalEvidenceAdminComponent', () => {
  let component: ModalEvidenceAdminComponent;
  let fixture: ComponentFixture<ModalEvidenceAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalEvidenceAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalEvidenceAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
