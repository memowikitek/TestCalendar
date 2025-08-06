import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeSettingsRecordComponent } from './welcome-settings-record.component';

describe('WelcomeSettingsRecordComponent', () => {
  let component: WelcomeSettingsRecordComponent;
  let fixture: ComponentFixture<WelcomeSettingsRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WelcomeSettingsRecordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WelcomeSettingsRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});