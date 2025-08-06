import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarProgressBsCaptureComponent } from './bar-progress-bs-capture.component';

describe('BarProgressBsCaptureComponent', () => {
  let component: BarProgressBsCaptureComponent;
  let fixture: ComponentFixture<BarProgressBsCaptureComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BarProgressBsCaptureComponent]
    });
    fixture = TestBed.createComponent(BarProgressBsCaptureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
