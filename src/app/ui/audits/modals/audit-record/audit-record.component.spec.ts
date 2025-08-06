import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditRecordComponent } from './audit-record.component';

describe('AuditRecordComponent', () => {
  let component: AuditRecordComponent;
  let fixture: ComponentFixture<AuditRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditRecordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
