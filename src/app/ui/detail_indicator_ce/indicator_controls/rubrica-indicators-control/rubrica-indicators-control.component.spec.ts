import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RubricaIndicatorsControlComponent } from './rubrica-indicators-control.component';

describe('RubricaIndicatorsControlComponent', () => {
  let component: RubricaIndicatorsControlComponent;
  let fixture: ComponentFixture<RubricaIndicatorsControlComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RubricaIndicatorsControlComponent]
    });
    fixture = TestBed.createComponent(RubricaIndicatorsControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
