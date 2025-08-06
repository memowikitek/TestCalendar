import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvidencesRecordComponent } from './evidences-record.component';

describe('EvidencesRecordComponent', () => {
  let component: EvidencesRecordComponent;
  let fixture: ComponentFixture<EvidencesRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvidencesRecordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EvidencesRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
