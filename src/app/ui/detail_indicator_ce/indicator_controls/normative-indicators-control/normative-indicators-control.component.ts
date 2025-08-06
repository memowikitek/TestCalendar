import { Component, Input, OnInit } from '@angular/core';
import { DetailsIndicatorsService, IndicatorsService } from 'src/app/core/services';
import { IndicatorsRecordService } from 'src/app/ui/indicators/modals';
import { EvidencesRecordService, MisionRecordService, NormativeRecordService } from '../../modals';
import { BasicNotification } from 'src/app/utils/helpers/basicNotification';
import { DetailsIndicatorDTOV1, DetailsIndicatorNormativaDTOV1, DetailsCeIndicatorNormativaDTOV1 } from 'src/app/utils/models';
import { MatTableDataSource } from '@angular/material/table';
import { Alert } from 'src/app/utils/helpers';
import { DetailsCeIndicatorLectura } from 'src/app/utils/models/detalles-ce-indicador-lectura.dto';

@Component({
  selector: 'app-normative-indicators-control',
  templateUrl: './normative-indicators-control.component.html',
  styleUrls: ['./normative-indicators-control.component.scss']
})
export class NormativeIndicatorsControlComponent implements OnInit {
  @Input() indicadorData: any;
  @Input() indLeer: boolean;
  @Input() permissions: string[];
  data: any[]
  dataSource: MatTableDataSource<DetailsIndicatorDTOV1>;
  lecturaIndicador: DetailsCeIndicatorLectura;

  constructor(
    private readonly indicadoresRecord: IndicatorsRecordService,
    private indicadores: IndicatorsService,
    private detailsIndicator: DetailsIndicatorsService,
    private readonly normativeRecords: NormativeRecordService,
    private indicatorService: IndicatorsService,
    private basicNotification : BasicNotification) {
      this.lecturaIndicador = new DetailsCeIndicatorLectura();
    }

    
  ngOnInit(): void {    
    this.indicatorService.currentReadState.subscribe((valor: boolean) => {
      this.indLeer = valor;
    });
    this.getCENormatives();
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

  public getCENormatives(): void {
    let resultado ;
    const {indicadorId, cicloEvaluacionId} = this.indicadorData;
    let filtro = {"indicadorId":indicadorId, "cicloEvaluacionId":cicloEvaluacionId}
    this.detailsIndicator.getCENormatives(filtro).subscribe((response) => {
      this.data = response.output.map((detailsIndicator) => 
        new DetailsCeIndicatorNormativaDTOV1().deserialize(detailsIndicator)
        );        
        // resultado = this.data.filter(e => e.indicadorSiacid == indicadorId);
        this.dataSource = new MatTableDataSource(this.data); 
        // debugger;   
    });
  }

  public addCeNormativa(): void {
    this.normativeRecords
        .open(this.dataSource.data)
        .afterClosed()
        .subscribe(() => this.getCENormatives());
  }

  deleteCeNormativa(indicador: DetailsCeIndicatorNormativaDTOV1): void {
    // console.log("ELIMINAR INDI "+indicador);
    Alert.confirm('Eliminar Normativa', `¿Deseas eliminar la normativa?`).subscribe((result) => {
      if (!result || !result.isConfirmed) {
        return;
      };
        this.detailsIndicator.deleteCeNormative(indicador).subscribe(() => {
          this.getCENormatives()
          this.basicNotification.notif("success",'Normativa eliminada correctamente', 5000);
        })
    });
  }  

  
  checkPermission(p: string): boolean {
    return this.permissions?.some(r => r.trim() == p.trim())
  }
}
