import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectionProcessComponent } from './selection-process.component';

describe('SelectionProcessComponent', () => {
  let component: SelectionProcessComponent;
  let fixture: ComponentFixture<SelectionProcessComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SelectionProcessComponent]
    });
    fixture = TestBed.createComponent(SelectionProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
