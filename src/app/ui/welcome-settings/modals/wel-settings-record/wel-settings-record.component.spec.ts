import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelSettingsRecordComponent } from './wel-settings-record.component';

describe('WelSettingsRecordComponent', () => {
  let component: WelSettingsRecordComponent;
  let fixture: ComponentFixture<WelSettingsRecordComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WelSettingsRecordComponent]
    });
    fixture = TestBed.createComponent(WelSettingsRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
