import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalImprovementPlanexecutionMultinivelUploadfileComponent } from './modal-improvement-planexecution-multinivel-uploadfile.component';

describe('ModalImprovementPlanexecutionMultinivelUploadfileComponent', () => {
  let component: ModalImprovementPlanexecutionMultinivelUploadfileComponent;
  let fixture: ComponentFixture<ModalImprovementPlanexecutionMultinivelUploadfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalImprovementPlanexecutionMultinivelUploadfileComponent]
    });
    fixture = TestBed.createComponent(ModalImprovementPlanexecutionMultinivelUploadfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
