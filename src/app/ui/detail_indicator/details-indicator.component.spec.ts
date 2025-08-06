import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsIndicatorComponent } from './details-indicator.component';

describe('DetailsIndicatorComponent', () => {
  let component: DetailsIndicatorComponent;
  let fixture: ComponentFixture<DetailsIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailsIndicatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
