import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicatorsRecordComponent } from './indicators-record.component';

describe('IndicatorsRecordComponent', () => {
  let component: IndicatorsRecordComponent;
  let fixture: ComponentFixture<IndicatorsRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndicatorsRecordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndicatorsRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
