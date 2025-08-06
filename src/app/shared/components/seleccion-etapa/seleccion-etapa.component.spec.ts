import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeleccionEtapaComponent } from './seleccion-etapa.component';

describe('SeleccionEtapaComponent', () => {
  let component: SeleccionEtapaComponent;
  let fixture: ComponentFixture<SeleccionEtapaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SeleccionEtapaComponent]
    });
    fixture = TestBed.createComponent(SeleccionEtapaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
