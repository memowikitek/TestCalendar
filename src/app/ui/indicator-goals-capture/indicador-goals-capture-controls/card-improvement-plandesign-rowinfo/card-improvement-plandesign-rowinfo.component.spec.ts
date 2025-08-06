import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardImprovementPlandesignRowinfoComponent } from './card-improvement-plandesign-rowinfo.component';

describe('CardImprovementPlandesignRowinfoComponent', () => {
  let component: CardImprovementPlandesignRowinfoComponent;
  let fixture: ComponentFixture<CardImprovementPlandesignRowinfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CardImprovementPlandesignRowinfoComponent]
    });
    fixture = TestBed.createComponent(CardImprovementPlandesignRowinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
