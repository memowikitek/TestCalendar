import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarProgressGrafComponent } from './bar-progress-graf.component';

describe('BarProgressGrafComponent', () => {
  let component: BarProgressGrafComponent;
  let fixture: ComponentFixture<BarProgressGrafComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BarProgressGrafComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BarProgressGrafComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
