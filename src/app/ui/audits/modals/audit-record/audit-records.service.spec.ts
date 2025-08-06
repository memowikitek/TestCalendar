import { TestBed } from '@angular/core/testing';

import { AuditRecordService } from './audit-records.service';

describe('AuditRecordsService', () => {
  let service: AuditRecordService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuditRecordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
