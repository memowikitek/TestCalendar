import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyInstitutionalReviewsComponent } from './my-institutional-reviews.component';

describe('MyInstitutionalReviewsComponent', () => {
  let component: MyInstitutionalReviewsComponent;
  let fixture: ComponentFixture<MyInstitutionalReviewsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyInstitutionalReviewsComponent]
    });
    fixture = TestBed.createComponent(MyInstitutionalReviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
