import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaRespIndicatorsControlComponent } from './area-resp-indicators-control.component';

describe('AreaRespIndicatorsControlComponent', () => {
  let component: AreaRespIndicatorsControlComponent;
  let fixture: ComponentFixture<AreaRespIndicatorsControlComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AreaRespIndicatorsControlComponent]
    });
    fixture = TestBed.createComponent(AreaRespIndicatorsControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
