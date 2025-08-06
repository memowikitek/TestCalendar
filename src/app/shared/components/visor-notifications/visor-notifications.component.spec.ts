import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisorNotificationsComponent } from './visor-notifications.component';

describe('VisorNotificationsComponent', () => {
  let component: VisorNotificationsComponent;
  let fixture: ComponentFixture<VisorNotificationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VisorNotificationsComponent]
    });
    fixture = TestBed.createComponent(VisorNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
