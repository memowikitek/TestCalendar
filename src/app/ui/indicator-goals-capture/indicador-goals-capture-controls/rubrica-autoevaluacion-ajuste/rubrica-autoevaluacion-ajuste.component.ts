import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DetailsIndicatorsService, IndicatorsService } from 'src/app/core/services';
import { CeRubricasDTOV1 } from 'src/app/utils/models/detalles-ce-rubricas-v1.dto';
import { Alert } from 'src/app/utils/helpers';
import { BasicNotification } from 'src/app/utils/helpers/basicNotification';
import { MisionDTO } from 'src/app/utils/models/mision.dto';
import { DetailsCeIndicatorLectura } from 'src/app/utils/models/detalles-ce-indicador-lectura.dto';
import { RubricaServiceService } from 'src/app/ui/detail_indicator_ce/modals';


@Component({
  selector: 'app-rubrica-autoevaluacion-ajuste',
  templateUrl: './rubrica-autoevaluacion-ajuste.component.html',
  styleUrls: ['./rubrica-autoevaluacion-ajuste.component.scss']
})
export class RubricaAutoevaluacionAjusteComponent {
  @Input() etapa: any;
  @Input() indicadorData: any;
  @Output() actualizaRubrica = new EventEmitter<any>();
  @Output() actualizaAjusteRubrica = new EventEmitter<any>();
  @Input() disabled= false;
  @Input() ajustar= false;
  @Input() disabledAjuste= false;

  data: any[];
  dataSourceRubricasNA: any;
  dataSourceRubricasDos: any;
  dataSourceRubricasCuatro: any;
  dataSourceRubricasSeis: any;
  dataSourceRubricasOcho: any;
  dataSourceRubricasDiez: any;
  dataSourceRubricas: MatTableDataSource<CeRubricasDTOV1>;
  nNA: any;
  ncero: any;
  ndos: any;
  ncuatro: any;
  nseis: any;
  nocho: any;
  ndiez: any;
  lecturaIndicador: DetailsCeIndicatorLectura;
  indLeer: boolean;
  newData: any[];
  @Input() columns =  ['escala','seleccionado','seleccionajustada','requisitoCondicion'];
  constructor(  ) {
    this.lecturaIndicador = new DetailsCeIndicatorLectura();
  }

  ngOnInit(): void {
    this.getCeRubricas()
  }

  public getCeRubricas(): void {
    let NAList;
    let ceroList;
    let dosList;
    let cuatroList;
    let seisList;
    let ochoList;
    let diezList;
    this.newData = this.indicadorData.map((obj: any, index: number) => {
      return { ...obj, id: index };
    }); //console.log('newData',this.newData);
    this.data = this.newData;    
    NAList = this.data.filter(e => e.escala == -1);
    ceroList = this.data.filter(e => e.escala == 0);
    dosList = this.data.filter(e => e.escala == 2);
    cuatroList = this.data.filter(e => e.escala == 4);
    seisList = this.data.filter(e => e.escala == 6);
    ochoList = this.data.filter(e => e.escala == 8);
    diezList = this.data.filter(e => e.escala == 10);
    this.dataSourceRubricasNA = new MatTableDataSource(NAList);
    this.nNA = this.dataSourceRubricasNA.filteredData.length; //console.log(this.nNA);
    this.dataSourceRubricas = new MatTableDataSource(ceroList);
    this.ncero = this.dataSourceRubricas.filteredData.length; //console.log(this.ncero);
    this.dataSourceRubricasDos = new MatTableDataSource(dosList);
    this.ndos = this.dataSourceRubricasDos.filteredData.length; //console.log(this.ndos);
    this.dataSourceRubricasCuatro = new MatTableDataSource(cuatroList);
    this.ncuatro = this.dataSourceRubricasCuatro.filteredData.length; //console.log(this.ncuatro);
    this.dataSourceRubricasSeis = new MatTableDataSource(seisList);
    this.nseis = this.dataSourceRubricasSeis.filteredData.length; //console.log(this.nseis);
    this.dataSourceRubricasOcho = new MatTableDataSource(ochoList);
    this.nocho = this.dataSourceRubricasOcho.filteredData.length; //console.log(this.nocho);
    this.dataSourceRubricasDiez = new MatTableDataSource(diezList);
    this.ndiez = this.dataSourceRubricasDiez.filteredData.length; //console.log(this.ndiez);
    // });
  }

  changeData(data: any, event: any) {
    let ind = this.indicadorData.findIndex((x: any) => x.ceetapa5RevisionAutoevaluacionRubricaId === data.ceetapa5RevisionAutoevaluacionRubricaId
    && x.requisitoCondicion === event.requisitoCondicion);

    if (ind != -1) {
      this.indicadorData[ind].seleccionado = event.checked;
      let informacionRubrica = {ceetapa5RevisionAutoevaluacionRubricaId: data.ceetapa5RevisionAutoevaluacionRubricaId,requisitoCondicion: event.requisitoCondicion, seleccionado : event.checked};
      this.actualizaRubrica.emit(informacionRubrica);
    }
  }

  /*changeDataAjuste(data: any, event: any) {
    let ind = this.indicadorData.findIndex((x: any) => x.ceetapa5RevisionAutoevaluacionRubricaId === data.ceetapa5RevisionAutoevaluacionRubricaId
    && x.requisitoCondicion === data.requisitoCondicion);
    if (ind != -1) {
      this.indicadorData[ind].seleccionAjustada = event.checked;
      let informacionRubrica = {ceetapa5RevisionAutoevaluacionRubricaId: data.ceetapa5RevisionAutoevaluacionRubricaId,requisitoCondicion: event.requisitoCondicion, seleccionAjustada : event.checked};
      this.actualizaAjusteRubrica.emit(informacionRubrica);
    }
  }*/

  //Revisión Institucional
  changeDataAjuste(data: any, event: any) {
    let ind = this.indicadorData.findIndex((x: any) => x.ceetapa5RevisionAutoevaluacionRubricaId === data.ceetapa5RevisionAutoevaluacionRubricaId 
    && x.requisitoCondicion === data.requisitoCondicion);
    if (ind != -1) {
      this.indicadorData[ind].seleccionAjustada = event.checked;
      let informacionRubrica = {id: data.id, rubricaEvaluacionId: data.rubricaEvaluacionId, ceetapa5RevisionAutoevaluacionRubricaId: data.ceetapa5RevisionAutoevaluacionRubricaId, requisitoCondicion: event.requisitoCondicion, seleccionAjustada: event.checked};
      this.actualizaAjusteRubrica.emit(informacionRubrica);
    }
  }
}
