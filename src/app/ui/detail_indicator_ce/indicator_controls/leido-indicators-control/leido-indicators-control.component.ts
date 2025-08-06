import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DetailsIndicatorsService } from 'src/app/core/services/api/details-indicators/details-indicators.service';
import { BasicNotification } from 'src/app/utils/helpers/basicNotification';
import { DetailsCeIndicatorLectura } from 'src/app/utils/models/detalles-ce-indicador-lectura.dto';
import { IndicatorsService } from 'src/app/core/services';

@Component({
  selector: 'app-leido-indicators-control',
  templateUrl: './leido-indicators-control.component.html',
  styleUrls: ['./leido-indicators-control.component.scss']
})
export class LeidoIndicatorsControlComponent implements OnInit {
  @Input() urlRetorno: any;
  @Input() permissions: string[];
  [x: string]: any;
  lecturaIndicador: DetailsCeIndicatorLectura;
  indicadorLeido: boolean = false;

  constructor(
    private http: HttpClient,
    private detailsIndicator: DetailsIndicatorsService,
    private basicNotification: BasicNotification,
    private indicatorService: IndicatorsService,
  ) {
    this.lecturaIndicador = new DetailsCeIndicatorLectura();
  }

  ngOnInit(): void {
    this.getLecturaIndicador();
    if(!this.indLeer) {
      this.indicatorService.currentReadState.subscribe((valor: boolean) => {
        this.indLeer = valor;
      });
    } else {
      this.indicadorLeido = true;
    }
    this.getLecturaIndicador();
  }
  
  getLecturaIndicador() {
    const {etapaId, ObligadoLeerIndicador, indicadorLeido } = JSON.parse(localStorage.getItem('idIndicadorSiac'));
    this.indLeer = etapaId > 0 && ObligadoLeerIndicador;
    this.indicadorLeido = indicadorLeido;
  }

  addLecturaIndicador() {
    const idIndicadorSiac = JSON.parse(localStorage.getItem('idIndicadorSiac'));

    this.lecturaIndicador.deserialize(idIndicadorSiac);

    this.detailsIndicator.addLecturaIndicador(this.lecturaIndicador).subscribe(() => {
      this.indLeer = false;
      this.basicNotification.notif("success", 'Su confirmación de lectura ha sido registrada', 5000);
      this.delayedRedirect("/indicator-goals-capture/detailindicator", 5000);
    });
  }

  delayedRedirect(url: string, delay: number) {
    setTimeout(() => {
      window.location.assign(url);
    }, delay);
  }

  retornarGeneracionEvaluacion() {
    window.location.assign(this.urlRetorno);
  }

  checkPermission(p: string): boolean {
    return this.permissions?.some(r => r.trim() == p.trim())
  }
}
