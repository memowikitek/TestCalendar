import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriteriaRecordComponent } from './criteria-record.component';

describe('CriteriaRecordComponent', () => {
  let component: CriteriaRecordComponent;
  let fixture: ComponentFixture<CriteriaRecordComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CriteriaRecordComponent]
    });
    fixture = TestBed.createComponent(CriteriaRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
