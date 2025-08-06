import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisionRecordComponent } from './mision-record.component';

describe('MisionRecordComponent', () => {
  let component: MisionRecordComponent;
  let fixture: ComponentFixture<MisionRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MisionRecordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MisionRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
