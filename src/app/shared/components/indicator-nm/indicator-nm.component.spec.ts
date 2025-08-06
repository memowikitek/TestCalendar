import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicatorNMComponent } from './indicator-nm.component';

describe('IndicatorNMComponent', () => {
  let component: IndicatorNMComponent;
  let fixture: ComponentFixture<IndicatorNMComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndicatorNMComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndicatorNMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
