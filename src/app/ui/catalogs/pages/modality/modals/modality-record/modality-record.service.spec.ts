import { TestBed } from '@angular/core/testing';

import { ModalityRecordService } from './modality-record.service';

describe('ModalityRecordService', () => {
  let service: ModalityRecordService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalityRecordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
