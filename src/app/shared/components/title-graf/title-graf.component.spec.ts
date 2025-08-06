import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TitleGrafComponent } from './title-graf.component';

describe('TitleGrafComponent', () => {
  let component: TitleGrafComponent;
  let fixture: ComponentFixture<TitleGrafComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TitleGrafComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TitleGrafComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
