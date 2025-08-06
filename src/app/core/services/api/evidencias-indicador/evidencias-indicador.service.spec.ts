import { TestBed } from '@angular/core/testing';

import { EvidenciasIndicadorService } from './evidencias-indicador.service';

describe('EvidenciasIndicadorService', () => {
  let service: EvidenciasIndicadorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EvidenciasIndicadorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
