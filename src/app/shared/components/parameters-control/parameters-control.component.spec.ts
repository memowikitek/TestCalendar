import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametersControlComponent } from './parameters-control.component';

describe('ParametersControlComponent', () => {
  let component: ParametersControlComponent;
  let fixture: ComponentFixture<ParametersControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParametersControlComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParametersControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
