import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarProgressBsComponent } from './bar-progress-bs.component';

describe('BarProgressBsComponent', () => {
  let component: BarProgressBsComponent;
  let fixture: ComponentFixture<BarProgressBsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BarProgressBsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BarProgressBsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
