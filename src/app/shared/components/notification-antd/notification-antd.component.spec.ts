import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationAntdComponent } from './notification-antd.component';

describe('NotificationAntdComponent', () => {
  let component: NotificationAntdComponent;
  let fixture: ComponentFixture<NotificationAntdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotificationAntdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationAntdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
