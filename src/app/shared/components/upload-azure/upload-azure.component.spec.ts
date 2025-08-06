import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadAzureComponent } from './upload-azure.component';

describe('UploadAzureComponent', () => {
  let component: UploadAzureComponent;
  let fixture: ComponentFixture<UploadAzureComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UploadAzureComponent]
    });
    fixture = TestBed.createComponent(UploadAzureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
