import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsSettingsRecordComponent } from './notifications-settings-record.component';

describe('NotificationsSettingsRecordComponent', () => {
  let component: NotificationsSettingsRecordComponent;
  let fixture: ComponentFixture<NotificationsSettingsRecordComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NotificationsSettingsRecordComponent]
    });
    fixture = TestBed.createComponent(NotificationsSettingsRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
