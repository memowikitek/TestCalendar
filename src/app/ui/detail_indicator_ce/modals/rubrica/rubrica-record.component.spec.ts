import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RubricaRecordComponent } from './rubrica-record.component';

describe('RubricaRecordComponent', () => {
  let component: RubricaRecordComponent;
  let fixture: ComponentFixture<RubricaRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RubricaRecordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RubricaRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
