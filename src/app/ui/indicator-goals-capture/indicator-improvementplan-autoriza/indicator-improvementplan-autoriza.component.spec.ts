import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicatorImprovementplanAutorizaComponent } from './indicator-improvementplan-autoriza.component';

describe('IndicatorImprovementplanAutorizaComponent', () => {
  let component: IndicatorImprovementplanAutorizaComponent;
  let fixture: ComponentFixture<IndicatorImprovementplanAutorizaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IndicatorImprovementplanAutorizaComponent]
    });
    fixture = TestBed.createComponent(IndicatorImprovementplanAutorizaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
