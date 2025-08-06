import { TestBed } from '@angular/core/testing';

import { ResultadosIndicadorService } from './resultados-indicador.service';

describe('ResultadosIndicadorService', () => {
  let service: ResultadosIndicadorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResultadosIndicadorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
