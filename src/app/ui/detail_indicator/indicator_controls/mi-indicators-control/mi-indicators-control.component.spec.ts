import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiIndicatorsControlComponent } from './mi-indicators-control.component';

describe('MiIndicatorsControlComponent', () => {
  let component: MiIndicatorsControlComponent;
  let fixture: ComponentFixture<MiIndicatorsControlComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MiIndicatorsControlComponent]
    });
    fixture = TestBed.createComponent(MiIndicatorsControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
