import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnioDataComponent } from './anio-data.component';

describe('AnioDataComponent', () => {
  let component: AnioDataComponent;
  let fixture: ComponentFixture<AnioDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnioDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnioDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
