import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LevelRecordComponent } from './level-record.component';

describe('levelRecordComponent', () => {
  let component: LevelRecordComponent;
  let fixture: ComponentFixture<LevelRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LevelRecordComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LevelRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
