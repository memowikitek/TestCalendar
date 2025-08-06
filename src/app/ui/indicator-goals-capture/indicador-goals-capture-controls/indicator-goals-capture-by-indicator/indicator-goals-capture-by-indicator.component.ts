import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { EvaluationCycleService, UsersService } from 'src/app/core/services';
import { BasicNotification } from 'src/app/utils/helpers/basicNotification';
import { TablePaginatorSearch } from 'src/app/utils/models';
import { CicloEvaluacionIndicadoresDTO } from 'src/app/utils/models/ciclo-evaluacion-indicadores.dto';
import { ModalIndicatorCaptureComponent } from '../modal-indicator-capture/modal-indicator-capture.component';
import { CEIndicadorEtapa1CampusDto } from 'src/app/utils/models/ceindicador-etapa1-campus.dto';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-indicator-goals-capture-by-indicator',
  templateUrl: './indicator-goals-capture-by-indicator.component.html',
  styleUrls: ['./indicator-goals-capture-by-indicator.component.scss']
})
export class IndicatorGoalsCaptureByIndicatorComponent implements OnInit {

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
    this.GetCeEvaluacionEtapa1All(this.filters);

    this.soloVisualiza = this.indicadorCapura.soloVisualiza;

  }

  private GetCeEvaluacionEtapa1All(filter: TablePaginatorSearch) {

    this.dataSource.data = [];
    this.data = [];
    if (!this.visualizarInformacionEtapa()) { // si no es etapado no llama a la api
      console.log('No consultará etapa1');
      return;
    }

    this.EvaCService.getCeEvaluacionEtapa1All(filter, this.indicadorCapura.CicloEvaluacionInfo.cicloEvaluacionId).subscribe((response) => {
      if (response.output) {
        this.data = response.output.indicadoresEtapa1;
        //   this.data = response.output.map((indicadorCiclo) => new CEIndicadorEtapa1CampusDto().deserialize(indicadorCiclo));
        this.dataSource.data = this.data;
        this.pageIndex = response.paginacion.pagina;
        this.pageSize = response.paginacion.registros;
        this.length = response.paginacion.count;

        // Actualizo la informacion de lectura
        if(this.noEmiteIndicadorLeido){
          return
        }
        let infomacionLectura = { indicadorLeido: response.output.indicadorLeido, obligadoLeerIndicador: response.output.obligadoLeerIndicador };
        this.actualizaLecturaIndicadorInfo.emit(infomacionLectura);
        // this.basicNotification.notif("success", 'Evaluación generada correctamente');
      } else {
        // this.basicNotification.notif("error", 'La evaluación No se genero');
      }
    });
  }
  paginatorChange(event: PageEvent): void {
    this.filters.pageSize = event.pageSize;
    this.filters.pageNumber = event.pageIndex;
    this.GetCeEvaluacionEtapa1All(this.filters);
  }


  captureGoal(row: any) {
    row.infoindicador = this.indicadorCapura; // se agreaga la infomacion de headers al objeto any
    row.esVista = false;
    row.puedeAutorizar = false;
    this.dialog.open<ModalIndicatorCaptureComponent>(ModalIndicatorCaptureComponent, {
      panelClass: '',
      data: row || null,
      width: '70vw',
      minWidth: '70vw',
      maxHeight: '90vh',
    }).afterClosed().subscribe((result) => {
      if (result) {
        this.GetCeEvaluacionEtapa1All(this.filters)
      }
    }
    );
  }

  viewGoal(row: any) {
    row.infoindicador = this.indicadorCapura; // se agreaga la infomacion de headers al objeto any
    row.esVista = true;
    row.puedeAutorizar = false;
    this.dialog.open<ModalIndicatorCaptureComponent>(ModalIndicatorCaptureComponent, {
      panelClass: '',
      data: row || null,
      width: '70vw',
      minWidth: '70vw',
      maxHeight: '90vh',
    }).afterClosed().subscribe((result) => {
      if (result) {
        this.GetCeEvaluacionEtapa1All(this.filters)
      }
    }
    );
  }


  puedeVisualizarEditar(element: any) {
    this.visualizarInformacionEtapa();
    if (this.soloVisualiza || element.estatusEtapa == 5) {
      return false;
    }

    return true;
  }


  puedeVisualizarEditarDeshabilitado(element: any) {
    this.visualizarInformacionEtapa();
    if (this.soloVisualiza) {
      return false;
    }

    if ((element.estatusEtapa != 5)) {
      return false;
    }

    return true;
  }


  visualizarInformacionEtapa(): boolean {
    
    if (environment.habilitaEtapas){
      let etapaActivaVisualizacion = this.etapasActivas.find((x: any) => x.id == this.indicadorCapura?.etapa);
      if (this.indicadorCapura?.etapa != 1 && !etapaActivaVisualizacion.active) {
        return false;
      }
  
      if (this.indicadorCapura?.etapa != 1 && etapaActivaVisualizacion.active) {
        this.soloVisualiza = etapaActivaVisualizacion.active
        this.noEmiteIndicadorLeido = true
      }
      return true;
    }
    else // si no tiene habilitada la variable global mantiene la logica inicial  
    {
      if (this.indicadorCapura?.etapa != 1) {
        return false;
      }

      return true
    }

  }

}
