import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardAutoEvaluationRowinfoComponent } from './card-auto-evaluation-rowinfo.component';

describe('CardAutoEvaluationRowinfoComponent', () => {
  let component: CardAutoEvaluationRowinfoComponent;
  let fixture: ComponentFixture<CardAutoEvaluationRowinfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CardAutoEvaluationRowinfoComponent]
    });
    fixture = TestBed.createComponent(CardAutoEvaluationRowinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
