import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CycleRecordComponent } from './cycle-record.component';

describe('CycleRecordComponent', () => {
  let component: CycleRecordComponent;
  let fixture: ComponentFixture<CycleRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CycleRecordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CycleRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
