import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaResponsableComponent } from './area-responsable.component';

describe('AreaResponsableComponent', () => {
  let component: AreaResponsableComponent;
  let fixture: ComponentFixture<AreaResponsableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AreaResponsableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AreaResponsableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
