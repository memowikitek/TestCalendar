import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeidoIndicatorsControlComponent } from './leido-indicators-control.component';

describe('LeidoIndicatorsControlComponent', () => {
  let component: LeidoIndicatorsControlComponent;
  let fixture: ComponentFixture<LeidoIndicatorsControlComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LeidoIndicatorsControlComponent]
    });
    fixture = TestBed.createComponent(LeidoIndicatorsControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
