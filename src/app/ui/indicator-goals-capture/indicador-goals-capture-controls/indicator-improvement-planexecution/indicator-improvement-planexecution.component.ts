import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { EvaluationCycleService, UsersService } from 'src/app/core/services';
import { BasicNotification } from 'src/app/utils/helpers/basicNotification';
import { TablePaginatorSearch } from 'src/app/utils/models';
import { CicloEvaluacionIndicadoresDTO } from 'src/app/utils/models/ciclo-evaluacion-indicadores.dto';
import { MatDialog } from '@angular/material/dialog';
import { EstatusEtapa3Resultados } from 'src/app/utils/models/enums-estatus-etapas';
import { ModalImprovementplanDecisionCaptureComponent } from '../modal-improvementplan-decision-capture/modal-improvementplan-decision-capture.component';
import { ModalImprovementPlanexecutionComponent } from '../modal-improvement-planexecution/modal-improvement-planexecution.component';
import { ModalImprovementPlanexecutionMultinivelUploadfileComponent } from '../modal-improvement-planexecution-multinivel-uploadfile/modal-improvement-planexecution-multinivel-uploadfile.component';

@Component({
  selector: 'app-indicator-improvement-planexecution',
  templateUrl: './indicator-improvement-planexecution.component.html',
  styleUrls: ['./indicator-improvement-planexecution.component.scss']
})
export class IndicatorImprovementPlanexecutionComponent {
  @Input() indicadorCapura: any;
  @Output() actualizaLecturaIndicadorInfo = new EventEmitter<any>();

  data: any[];
  dataSource: MatTableDataSource<CicloEvaluacionIndicadoresDTO>;
  filters: TablePaginatorSearch;
  pageIndex: number;
  pageSize: number;
  length: number;
  cicloEva: any;

  soloVisualiza = false;
  decisionAreaKeyValue : any;
  usuariotipoRol = 1;
  noEmiteIndicadorLeido = false

  constructor(private readonly EvaCService: EvaluationCycleService,
    private basicNotification: BasicNotification,
    private router: Router,
    private dialog: MatDialog,
    private users: UsersService) {
    this.dataSource = new MatTableDataSource<CicloEvaluacionIndicadoresDTO>;
    this.usuariotipoRol = this.users.userSession.tipoRol;
  }

  ngOnInit(): void {
    this.cicloEva = JSON.parse(localStorage.getItem('cicloEva'));
    this.filters = new TablePaginatorSearch();
    this.filters.pageSize = 0;
    this.filters.pageNumber = 0;    
    this.filters.filter = {
      "cicloEvaluacionId": this.indicadorCapura.cicloEvaluacionId,
      "indicadorId": this.indicadorCapura.indicadorId,
      "campusId": this.indicadorCapura.campusId,
      "areaResponsableId": this.indicadorCapura.areaResponsableId ? this.indicadorCapura.areaResponsableId : this.indicadorCapura.areaId,
      "usuarioId": this.users.userSession.id,
      "procesoEvaluacionId": this.indicadorCapura.CicloEvaluacionInfo.procesoEvaluacionId,
      "etapaId": 7
    };
    this.GetCeEvaluacionEtapaAll(this.filters);

    this.soloVisualiza = this.indicadorCapura.soloVisualiza;
  }

  private GetCeEvaluacionEtapaAll(filter: TablePaginatorSearch) {
    this.dataSource.data = [];
    this.data = [];

    if (!(this.indicadorCapura?.etapa == 7)) { // si no es etapado no llama a la api
      console.log('No consultará etapa7');
      return;
    }

    this.EvaCService.getCeIndicadoresEtapa6PMEAll(filter).subscribe((response) => {
      if (response.output) {
        this.data = response.output.indicadoresEtapas;
        //   this.data = response.output.map((indicadorCiclo) => new CEIndicadorEtapa1CampusDto().deserialize(indicadorCiclo));
        this.dataSource.data = this.data;
        this.pageIndex = response.paginacion.pagina;
        this.pageSize = response.paginacion.registros;
        this.length = response.paginacion.count;

        this.decisionAreaKeyValue = response.output.decisionAreaKeyValue;
        // Actualizo la informacion de lectura
        if(this.noEmiteIndicadorLeido){
          return
        }
        let infomacionLectura = { indicadorLeido: response.output.indicadorLeido, obligadoLeerIndicador: response.output.obligadoLeerIndicador };
        this.actualizaLecturaIndicadorInfo.emit(infomacionLectura);
      } else {
      }
    });
  }
  paginatorChange(event: PageEvent): void {
    this.filters.pageSize = event.pageSize;
    this.filters.pageNumber = event.pageIndex;
    this.GetCeEvaluacionEtapaAll(this.filters);
  }


  captureData(row: any) {
    row.elminaArchivo = false;
    row.esCarga = true;
    row.infoindicador = this.indicadorCapura; // se agreaga la infomacion de headers al objeto any
    row.esVista = false;
    row.puedeAutorizar = false;
    row.decisionAreaKeyValue = this.decisionAreaKeyValue;
    this.dialog.open<ModalImprovementPlanexecutionComponent>(ModalImprovementPlanexecutionComponent, {
      panelClass: '',
      data: row || null,
      width: '70vw',
      minWidth: '70vw',
      maxHeight: '90vh',
    }).afterClosed().subscribe((result: any) => {
        this.GetCeEvaluacionEtapaAll(this.filters)
    }
    );
  }

  captureDataMultinivel()
  {
    
    let data = this.data.filter(ar => ar.decisionArea == 2 || ar.decisionArea == 3 || ar.decisionArea == 4); 
    data[0].esCarga = true;
    data[0].infoindicador = this.indicadorCapura; // se agreaga la infomacion de headers al objeto any
    data[0].esVista = false;
    data[0].puedeAutorizar = false;
    data[0].decisionAreaKeyValue = this.decisionAreaKeyValue;
    this.dialog.open<ModalImprovementPlanexecutionMultinivelUploadfileComponent>(ModalImprovementPlanexecutionMultinivelUploadfileComponent, {
      panelClass: '',
      data: data || null,
      width: '70vw',
      minWidth: '70vw',
      maxHeight: '90vh',
    }).afterClosed().subscribe((result: any) => {
        this.GetCeEvaluacionEtapaAll(this.filters)
    }
    );
  }

  consulta(row: any) {
    row.edit = true;
    row.elminaArchivo = true;
    row.esCarga = false;
    row.infoindicador = this.indicadorCapura; // se agreaga la infomacion de headers al objeto any
    row.esVista = true;
    row.puedeAutorizar = false;
    row.decisionAreaKeyValue = this.decisionAreaKeyValue; // sea agregan las sugerencias siac que vinieron en el modelo para que se cargen en el modal 
    this.dialog.open<ModalImprovementPlanexecutionComponent>(ModalImprovementPlanexecutionComponent, {
      panelClass: '',
      data: row || null,
      width: '70vw',
      minWidth: '70vw',
      maxHeight: '90vh',
    }).afterClosed().subscribe((result: any) => {
        this.GetCeEvaluacionEtapaAll(this.filters)
    }
    );
  }

  viewGoal(row: any) {
    row.edit = false;
    row.elminaArchivo = false;
    row.esCarga = false;
    row.infoindicador = this.indicadorCapura; // se agreaga la infomacion de headers al objeto any
    row.esVista = true;
    row.puedeAutorizar = false;
    row.decisionAreaKeyValue = this.decisionAreaKeyValue; // sea agregan las sugerencias siac que vinieron en el modelo para que se cargen en el modal 
    this.dialog.open<ModalImprovementPlanexecutionComponent>(ModalImprovementPlanexecutionComponent, {
      panelClass: '',
      data: row || null,
      width: '70vw',
      minWidth: '70vw',
      maxHeight: '90vh',
    }).afterClosed().subscribe((result: any) => {
        this.GetCeEvaluacionEtapaAll(this.filters)
    }
    );
  }

  obtenerTextoComplimientoAnterior(data: any) {

    if (data == null) {
      return '';
    }
    return data == true ? 'Sí' : 'No';
  }

  obtenerTextoSeCumplemetaActual(data: any) {

    if (data == null) {
      return '';
    }
    return data == true ? 'Sí' : 'No';
  }

  puedeVisualizarEditar(element: any) {

    if (this.soloVisualiza) {
      return false;
    }

    if (element.decisionArea == 0 || element.decisionArea == 1 || element.decisionArea == 5 )
    {
      return false
    }

    return true;
  }


  puedeVisualizarEditarDeshabilitado(element: any) 
  { 
    if (!this.soloVisualiza) {
      return false;
    }
    
    if ((element.estatusEtapa != EstatusEtapa3Resultados.naautorizado)) {
      return false;
    }

    if (element.decisionArea == 2 || element.decisionArea == 3 || element.decisionArea == 4 )
    {
        return false
    }
    
    return true;
  }

  puedeVisualizarConsulta(element: any) {

    if (element.decisionArea == 0 || element.decisionArea == 1 || element.decisionArea == 5 )
    {
      return false
    }

    return true;
  }

  puedeVisualizarConsultaDeshabilitado(element: any) 
  { 

    if (element.decisionArea == 2 || element.decisionArea == 3 || element.decisionArea == 4 )
    {
        return false
    }
    
    return true;
  }

  puedeVisualizarMultiple(){
    
    let data = this.data.filter(ar => ar.decisionArea == 2 || ar.decisionArea == 3 || ar.decisionArea == 4); 
    if (this.usuariotipoRol == 1 && !this.soloVisualiza && data?.length > 0){
      return true;
    }
  
    return false
  }

}
