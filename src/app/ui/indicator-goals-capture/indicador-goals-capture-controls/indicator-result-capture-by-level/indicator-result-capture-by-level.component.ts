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
import { EstatusEtapa3Resultados } from 'src/app/utils/models/enums-estatus-etapas';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-indicator-result-capture-by-level',
  templateUrl: './indicator-result-capture-by-level.component.html',
  styleUrls: ['./indicator-result-capture-by-level.component.scss']
})
export class IndicatorResultCaptureByLevelComponent {
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
  noEmiteIndicadorLeido = false

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
      console.log('No consultará etapa3');
      return;
    }

    this.EvaCService.getCeEvaluacionEtapa3All(filter, this.indicadorCapura.CicloEvaluacionInfo.cicloEvaluacionId).subscribe((response) => {
      if (response.output) {
        this.data = response.output.indicadoresEtapas;
        //   this.data = response.output.map((indicadorCiclo) => new CEIndicadorEtapa1CampusDto().deserialize(indicadorCiclo));
        this.dataSource.data = this.data;
        this.pageIndex = response.paginacion.pagina;
        this.pageSize = response.paginacion.registros;
        this.length = response.paginacion.count;

        if(this.noEmiteIndicadorLeido){
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
    this.dialog.open<ModalResultCaptureComponent>(ModalResultCaptureComponent, {
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
    this.dialog.open<ModalResultCaptureComponent>(ModalResultCaptureComponent, {
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
    if (this.soloVisualiza || element.estatusEtapa == EstatusEtapa3Resultados.naautorizado) {
      return false;
    }

    return true;
  }


  puedeVisualizarEditarDeshabilitado(element: any) 
  { 
    this.visualizarInformacionEtapa()
    if (this.soloVisualiza) {
      return false;
    }
    
    if ((element.estatusEtapa != EstatusEtapa3Resultados.naautorizado)) {
      return false;
    }

    return true;
  }

  visualizarInformacionEtapa(): boolean {
    
    let numeroEtapa = 3
    if (environment.habilitaEtapas){
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
