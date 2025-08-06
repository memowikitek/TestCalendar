import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalityRecordComponent } from './modality-record.component';

describe('ModalityRecordComponent', () => {
  let component: ModalityRecordComponent;
  let fixture: ComponentFixture<ModalityRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalityRecordComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalityRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
