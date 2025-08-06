import { Component, Input, OnInit } from '@angular/core';
import { MisionRecordService } from '../../modals';
import { MatTableDataSource } from '@angular/material/table';
import { ComponenteCEMIDTO } from 'src/app/utils/models';
import { DetailsIndicatorsService, IndicatorsService } from 'src/app/core/services';
import { Alert } from 'src/app/utils/helpers';
import { BasicNotification } from 'src/app/utils/helpers/basicNotification';
import { DetailsCeIndicatorLectura } from 'src/app/utils/models/detalles-ce-indicador-lectura.dto';

@Component({
  selector: 'app-mi-indicators-control',
  templateUrl: './mi-indicators-control.component.html',
  styleUrls: ['./mi-indicators-control.component.scss']
})
export class MiIndicatorsControlComponent implements OnInit {

  @Input() indicadorData: any;
  @Input() indLeer: boolean;
  @Input() permissions: string[];
  data: any[];
  dataSourceMision: MatTableDataSource<ComponenteCEMIDTO>;
  lecturaIndicador: DetailsCeIndicatorLectura;
  
  constructor
  (    
    private readonly misionRecords: MisionRecordService,
    private detailsIndicator: DetailsIndicatorsService,
    private indicatorService: IndicatorsService,
    private basicNotification : BasicNotification
  ){
    this.lecturaIndicador = new DetailsCeIndicatorLectura();
  }

  ngOnInit(): void {
    this.indicatorService.currentReadState.subscribe((valor: boolean) => {
      this.indLeer = valor;
    });
    this.getCeMision();
    this.getLecturaIndicador();
  }
  
  getLecturaIndicador() {
    const {etapaId, ObligadoLeerIndicador } = JSON.parse(localStorage.getItem('idIndicadorSiac'));
    if(etapaId > 0){
      this.indLeer = true;
    }
    else {
      this.indLeer = false;
    }
  }

  public addCeMision(): void {
    this.misionRecords
      .open(this.dataSourceMision.data)
      .afterClosed()
      .subscribe(() => this.getCeMision());
  }

  public getCeMision(): void {
    const {indicadorId, cicloEvaluacionId} = this.indicadorData;
    let filtro = {"indicadorId":indicadorId, "cicloEvaluacionId":cicloEvaluacionId}
    this.detailsIndicator.getAllCeIndicadoresMision(filtro).subscribe((response) => {
      this.data = response.output.map((detailsIndicator) => new ComponenteCEMIDTO().deserialize(detailsIndicator));        
      this.dataSourceMision = new MatTableDataSource(this.data);    
    });
  }

  deleteCeMI(indicador: ComponenteCEMIDTO): void {
    Alert.confirm('Eliminar Misión Institucional', `¿Deseas eliminar la Misión Institucional?`).subscribe((result) => {
      if (!result || !result.isConfirmed) {
        return;
      };
      this.detailsIndicator.deleteCeMision(indicador).subscribe(() => {
        this.getCeMision()
        this.basicNotification.notif("success",'Misión Institucional eliminada correctamente', 5000);
      });
    });
  }

  checkPermission(p: string): boolean {
    return this.permissions?.some(r => r.trim() == p.trim())
  }

}
