import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyNotificationsSettingsComponent } from './my-notifications-settings.component';

describe('MyNotificationsSettingsComponent', () => {
  let component: MyNotificationsSettingsComponent;
  let fixture: ComponentFixture<MyNotificationsSettingsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyNotificationsSettingsComponent]
    });
    fixture = TestBed.createComponent(MyNotificationsSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
