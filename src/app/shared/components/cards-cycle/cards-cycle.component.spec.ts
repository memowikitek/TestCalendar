import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardsCycleComponent } from './cards-cycle.component';

describe('CardsCycleComponent', () => {
  let component: CardsCycleComponent;
  let fixture: ComponentFixture<CardsCycleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CardsCycleComponent]
    });
    fixture = TestBed.createComponent(CardsCycleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
