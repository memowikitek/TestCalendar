import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectionStagesComponent } from './selection-stages.component';

describe('SelectionStagesComponent', () => {
  let component: SelectionStagesComponent;
  let fixture: ComponentFixture<SelectionStagesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SelectionStagesComponent]
    });
    fixture = TestBed.createComponent(SelectionStagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
