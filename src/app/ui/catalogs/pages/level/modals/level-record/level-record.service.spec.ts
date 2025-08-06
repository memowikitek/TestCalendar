import { TestBed } from '@angular/core/testing';

import { LevelRecordService } from './level-record.service';

describe('levelRecordService', () => {
  let service: LevelRecordService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LevelRecordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
