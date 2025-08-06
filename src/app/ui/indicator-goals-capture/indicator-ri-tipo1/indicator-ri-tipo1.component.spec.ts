import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicatorRiTipo1Component } from './indicator-ri-tipo1.component';

describe('IndicatorRiTipo1Component', () => {
  let component: IndicatorRiTipo1Component;
  let fixture: ComponentFixture<IndicatorRiTipo1Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IndicatorRiTipo1Component]
    });
    fixture = TestBed.createComponent(IndicatorRiTipo1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
