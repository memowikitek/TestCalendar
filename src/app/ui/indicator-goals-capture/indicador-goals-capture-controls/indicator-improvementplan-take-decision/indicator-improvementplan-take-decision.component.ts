import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { EvaluationCycleService, UsersService } from 'src/app/core/services';
import { BasicNotification } from 'src/app/utils/helpers/basicNotification';
import { TablePaginatorSearch } from 'src/app/utils/models';
import { CicloEvaluacionIndicadoresDTO } from 'src/app/utils/models/ciclo-evaluacion-indicadores.dto';
import { MatDialog } from '@angular/material/dialog';
import { ModalResultCaptureComponent } from '../modal-result-capture/modal-result-capture.component';
import { EstatusEtapa6Plandemejora } from 'src/app/utils/models/enums-estatus-etapas';
import { ModalImprovementplanDecisionCaptureComponent } from '../modal-improvementplan-decision-capture/modal-improvementplan-decision-capture.component';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-indicator-improvementplan-take-decision',
  templateUrl: './indicator-improvementplan-take-decision.component.html',
  styleUrls: ['./indicator-improvementplan-take-decision.component.scss']
})
export class IndicatorImprovementplanTakeDecisionComponent {
  @Input() indicadorCapura: any;
  @Input() etapasActivas: any;

  @Output() actualizaLecturaIndicadorInfo = new EventEmitter<any>();

  data: any[];
  dataSource: MatTableDataSource<CicloEvaluacionIndicadoresDTO>;
  filters: TablePaginatorSearch;
  pageIndex: number;
  pageSize: number;
  length: number;
  cicloEva: any;

  soloVisualiza = false;
  decisionAreaKeyValue: any;

  estatusEtapa6Plandemejora = EstatusEtapa6Plandemejora;
  noEmiteIndicadorLeido = false
  esAreaConsolidada = false;
  constructor(private readonly EvaCService: EvaluationCycleService,
    private basicNotification: BasicNotification,
    private router: Router,
    private dialog: MatDialog,
    private users: UsersService) {
    this.dataSource = new MatTableDataSource<CicloEvaluacionIndicadoresDTO>;
  }

  ngOnInit(): void {
    this.cicloEva = JSON.parse(localStorage.getItem('cicloEva'));
    this.filters = new TablePaginatorSearch();
    this.filters.pageSize = 0;
    this.filters.pageNumber = 0;

    if (this.indicadorCapura && this.indicadorCapura.esAreaConsolidada) {
      this.esAreaConsolidada = this.indicadorCapura.esAreaConsolidada
    }

    this.filters.filter = {
      "cicloEvaluacionId": this.indicadorCapura.CicloEvaluacionInfo.cicloEvaluacionId,
      "indicadorId": this.indicadorCapura.indicadorId,
      "campusId": this.indicadorCapura.campusId,
      "areaResponsableId": this.indicadorCapura.AreaResponsableid,
      "usuarioId": this.users.userSession.id,
      "procesoEvaluacionId": this.indicadorCapura.CicloEvaluacionInfo.procesoEvaluacionId,
      "etapaId": this.indicadorCapura.CicloEvaluacionInfo.etapaEvaluacion[0].etapaId
    };
    this.GetCeEvaluacionEtapaAll(this.filters);

    this.soloVisualiza = this.indicadorCapura.soloVisualiza;

  }

  private GetCeEvaluacionEtapaAll(filter: TablePaginatorSearch) {
    this.dataSource.data = [];
    this.data = [];

    if (!this.visualizarInformacionEtapa()) { // si no es etapado no llama a la api
      console.log('No consultará etapa6');
      return;
    }

    this.EvaCService.getCeIndicadoresEtapa6PMDAll(filter).subscribe((response) => {
      if (response.output) {
        this.data = response.output.indicadoresEtapas;
        //   this.data = response.output.map((indicadorCiclo) => new CEIndicadorEtapa1CampusDto().deserialize(indicadorCiclo));
        this.dataSource.data = this.data;
        this.pageIndex = response.paginacion.pagina;
        this.pageSize = response.paginacion.registros;
        this.length = response.paginacion.count;

        this.decisionAreaKeyValue = response.output.decisionAreaKeyValue;
        if (this.noEmiteIndicadorLeido) {
          return
        }
        // Actualizo la informacion de lectura
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
    row.infoindicador = this.indicadorCapura; // se agreaga la infomacion de headers al objeto any
    row.esVista = false;
    row.puedeAutorizar = false;
    row.decisionAreaKeyValue = this.decisionAreaKeyValue;
    this.dialog.open<ModalImprovementplanDecisionCaptureComponent>(ModalImprovementplanDecisionCaptureComponent, {
      panelClass: '',
      data: row || null,
      width: '70vw',
      minWidth: '70vw',
      maxHeight: '90vh',
    }).afterClosed().subscribe((result: any) => {
      if (result) {
        this.GetCeEvaluacionEtapaAll(this.filters)
      }
    }
    );
  }

  viewGoal(row: any) {
    row.infoindicador = this.indicadorCapura; // se agreaga la infomacion de headers al objeto any
    row.esVista = true;
    row.puedeAutorizar = false;
    row.decisionAreaKeyValue = this.decisionAreaKeyValue; // sea agregan las sugerencias siac que vinieron en el modelo para que se cargen en el modal 
    this.dialog.open<ModalImprovementplanDecisionCaptureComponent>(ModalImprovementplanDecisionCaptureComponent, {
      panelClass: '',
      data: row || null,
      width: '70vw',
      minWidth: '70vw',
      maxHeight: '90vh',
    }).afterClosed().subscribe((result: any) => {
      if (result) {
        this.GetCeEvaluacionEtapaAll(this.filters)
      }
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
    this.visualizarInformacionEtapa()
    
    if (this.esAreaConsolidada) {
      return false
    }

    if (this.soloVisualiza) {
      return false;
    }

    if
    (
      element.estatusEtapa == this.estatusEtapa6Plandemejora.noSeRealiza_Autorizado ||
      element.estatusEtapa == this.estatusEtapa6Plandemejora.no_Requerida
    ) 
    {
      return false;
    }

    return true;
  }

  puedeVisualizarEditarDeshabilitado(element: any) {
    this.visualizarInformacionEtapa()

    if (this.esAreaConsolidada) {
      return false
    }

    if (this.soloVisualiza) {
      return false;
    }

    if 
    (
      element.estatusEtapa == this.estatusEtapa6Plandemejora.pendiente ||
      element.estatusEtapa == this.estatusEtapa6Plandemejora.decisionTomada ||
      element.estatusEtapa == this.estatusEtapa6Plandemejora.noSeRealiza_EnRevisión ||
      element.estatusEtapa == this.estatusEtapa6Plandemejora.noSeRealiza_No_Autorizado
    ) 
    {
      return false;
    }

    return true;
  }

  visualizarInformacionEtapa(): boolean {

    let numeroEtapa = 6
    if (environment.habilitaEtapas) {
      let etapaActivaVisualizacion = this.etapasActivas.find((x: any) => x.id == this.indicadorCapura?.etapa);
      if (this.indicadorCapura?.etapa != numeroEtapa && !etapaActivaVisualizacion.active) {
        return false;
      }

      if (this.indicadorCapura?.etapa != numeroEtapa && etapaActivaVisualizacion.active) {
        this.soloVisualiza = etapaActivaVisualizacion.active
        this.noEmiteIndicadorLeido = true
      }
      return true;
    }
    else // si no tiene habilitada la variable global mantiene la logica inicial  
    {
      if (this.indicadorCapura?.etapa != numeroEtapa) {
        return false;
      }

      return true
    }
  }
}
