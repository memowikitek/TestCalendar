import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardImprovementPlanexecutionRowinfoComponent } from './card-improvement-planexecution-rowinfo.component';

describe('CardImprovementPlanexecutionRowinfoComponent', () => {
  let component: CardImprovementPlanexecutionRowinfoComponent;
  let fixture: ComponentFixture<CardImprovementPlanexecutionRowinfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CardImprovementPlanexecutionRowinfoComponent]
    });
    fixture = TestBed.createComponent(CardImprovementPlanexecutionRowinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
