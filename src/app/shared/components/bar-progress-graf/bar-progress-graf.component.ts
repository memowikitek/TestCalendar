import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
    selector: 'app-bar-progress-graf',
    templateUrl: './bar-progress-graf.component.html',
    styleUrls: ['./bar-progress-graf.component.scss'],
    standalone: false
})
export class BarProgressGrafComponent implements OnInit, OnChanges {
  @Input() porcentaje: number;
  porcentajeCal: number = 250;
  porciento: number = 1.9;
  counter: number = 0;
  intervalId: any;

  constructor() { }

  ngOnInit(): void {
    this.load();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['porcentaje']) {
      //console.log(this.porcentaje);
      if(this.porcentaje <= 100){
        this.load();
      }else{
        const msj = 'Error: El valor de porcentaje rebaso el límite del 100% en el gráfico de avance, porcentaje actual: '+this.porcentaje;
        console.error(msj);
      }
    }
  }

  load(): void {
    // Detener cualquier intervalo previo
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    // Reiniciar el contador y recalcular porcentajeCal
    this.counter = 0;
    this.porcentajeCal = 250 - (this.porcentaje * this.porciento);

    // Iniciar la animación de carga
    this.intervalId = setInterval(() => {
      if (this.counter >= this.porcentaje) {
        clearInterval(this.intervalId);
      } else {
        this.counter += 1;
        // La lógica de cálculo de porcentajeCal ya se hace en load
      }
    }, 50);
  }

}
