import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyNotificationsTrackingComponent } from './my-notifications-tracking.component';

describe('MyNotificationsTrackingComponent', () => {
  let component: MyNotificationsTrackingComponent;
  let fixture: ComponentFixture<MyNotificationsTrackingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyNotificationsTrackingComponent]
    });
    fixture = TestBed.createComponent(MyNotificationsTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
