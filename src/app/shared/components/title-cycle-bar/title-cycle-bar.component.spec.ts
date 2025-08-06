import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TitleCycleBarComponent } from './title-cycle-bar.component';

describe('TitleCycleBarComponent', () => {
  let component: TitleCycleBarComponent;
  let fixture: ComponentFixture<TitleCycleBarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TitleCycleBarComponent]
    });
    fixture = TestBed.createComponent(TitleCycleBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
