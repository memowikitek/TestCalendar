import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumenBarComponent } from './resumen-bar.component';

describe('ResumenBarComponent', () => {
  let component: ResumenBarComponent;
  let fixture: ComponentFixture<ResumenBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResumenBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResumenBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
