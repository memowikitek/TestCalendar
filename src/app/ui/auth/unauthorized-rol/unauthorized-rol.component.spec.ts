import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnauthorizedRolComponent } from './unauthorized-rol.component';

describe('UnauthorizedRolComponent', () => {
  let component: UnauthorizedRolComponent;
  let fixture: ComponentFixture<UnauthorizedRolComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UnauthorizedRolComponent]
    });
    fixture = TestBed.createComponent(UnauthorizedRolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
