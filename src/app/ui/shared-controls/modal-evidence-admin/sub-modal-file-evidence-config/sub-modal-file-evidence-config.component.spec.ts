import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubModalFileEvidenceConfigComponent } from './sub-modal-file-evidence-config.component';

describe('SubModalFileEvidenceConfigComponent', () => {
  let component: SubModalFileEvidenceConfigComponent;
  let fixture: ComponentFixture<SubModalFileEvidenceConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubModalFileEvidenceConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubModalFileEvidenceConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
