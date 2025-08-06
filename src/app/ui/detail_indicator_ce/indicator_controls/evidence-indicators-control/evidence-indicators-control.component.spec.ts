import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvidenceIndicatorsControlComponent } from './evidence-indicators-control.component';

describe('EvidenceIndicatorsControlComponent', () => {
  let component: EvidenceIndicatorsControlComponent;
  let fixture: ComponentFixture<EvidenceIndicatorsControlComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EvidenceIndicatorsControlComponent]
    });
    fixture = TestBed.createComponent(EvidenceIndicatorsControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
