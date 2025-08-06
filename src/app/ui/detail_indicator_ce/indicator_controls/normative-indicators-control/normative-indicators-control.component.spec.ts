import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NormativeIndicatorsControlComponent } from './normative-indicators-control.component';

describe('NormativeIndicatorsControlComponent', () => {
  let component: NormativeIndicatorsControlComponent;
  let fixture: ComponentFixture<NormativeIndicatorsControlComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NormativeIndicatorsControlComponent]
    });
    fixture = TestBed.createComponent(NormativeIndicatorsControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
