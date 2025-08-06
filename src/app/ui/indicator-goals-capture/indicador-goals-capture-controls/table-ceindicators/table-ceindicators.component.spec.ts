import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableCEIndicatorsComponent } from './table-ceindicators.component';

describe('TableCEIndicatorsComponent', () => {
  let component: TableCEIndicatorsComponent;
  let fixture: ComponentFixture<TableCEIndicatorsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TableCEIndicatorsComponent]
    });
    fixture = TestBed.createComponent(TableCEIndicatorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
