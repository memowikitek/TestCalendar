import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableCeindicatorsRiComponent } from './table-ceindicators-ri.component';

describe('TableCeindicatorsRiComponent', () => {
  let component: TableCeindicatorsRiComponent;
  let fixture: ComponentFixture<TableCeindicatorsRiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TableCeindicatorsRiComponent]
    });
    fixture = TestBed.createComponent(TableCeindicatorsRiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
