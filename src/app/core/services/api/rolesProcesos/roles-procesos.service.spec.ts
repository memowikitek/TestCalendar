import { TestBed } from '@angular/core/testing';

import { RolesProcesosService } from './roles-procesos.service';

describe('RolesProcesosService', () => {
  let service: RolesProcesosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RolesProcesosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
