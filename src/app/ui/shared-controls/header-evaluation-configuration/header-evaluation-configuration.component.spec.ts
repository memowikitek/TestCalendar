import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderEvaluationConfigurationComponent } from './header-evaluation-configuration.component';

describe('HeaderEvaluationConfigurationComponent', () => {
  let component: HeaderEvaluationConfigurationComponent;
  let fixture: ComponentFixture<HeaderEvaluationConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderEvaluationConfigurationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderEvaluationConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
