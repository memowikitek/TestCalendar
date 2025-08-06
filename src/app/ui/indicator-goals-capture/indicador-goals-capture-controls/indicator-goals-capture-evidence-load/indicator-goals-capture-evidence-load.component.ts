import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { EvaluationCycleService, UsersService } from 'src/app/core/services';
import { BasicNotification } from 'src/app/utils/helpers/basicNotification';
import { TablePaginatorSearch } from 'src/app/utils/models';
import { CicloEvaluacionIndicadoresDTO } from 'src/app/utils/models/ciclo-evaluacion-indicadores.dto';
import { ModalIndicatorCaptureComponent } from '../modal-indicator-capture/modal-indicator-capture.component';
import { MatDialog } from '@angular/material/dialog';
import { ModalEvidenceCaptureComponent } from '../modal-evidence-capture/modal-evidence-capture.component';
import { EstatusEtapa2Evidencias } from 'src/app/utils/models/enums-estatus-etapas';
import { environment } from 'src/environments/environment';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-indicator-goals-capture-evidence-load',
  templateUrl: './indicator-goals-capture-evidence-load.component.html',
  styleUrls: ['./indicator-goals-capture-evidence-load.component.scss']
})
export class IndicatorGoalsCaptureEvidenceLoadComponent implements OnInit {

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
  private searchsub$ = new Subject<string>();
  
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
      "etapaId": this.indicadorCapura.CicloEvaluacionInfo.etapaEvaluacion[0].etapaId,
      "textoBusqueda": null
    };
    this.GetCeEvaluacionEtapa2All(this.filters);
    this.soloVisualiza = this.indicadorCapura.soloVisualiza ;

    this.searchsub$.pipe(debounceTime(300), distinctUntilChanged()).subscribe((filtervalue: string) => {
    
      this.filters.filter = {
         "cicloEvaluacionId": this.indicadorCapura.CicloEvaluacionInfo.cicloEvaluacionId,
         "indicadorId": this.indicadorCapura.indicadorId,
         "campusId": this.indicadorCapura.campusId,
         "areaResponsableId": this.indicadorCapura.AreaResponsableid,
         "usuarioId": this.users.userSession.id,
         "procesoEvaluacionId": this.indicadorCapura.CicloEvaluacionInfo.procesoEvaluacionId,
         "etapaId": this.indicadorCapura.CicloEvaluacionInfo.etapaEvaluacion[0].etapaId,
         "textoBusqueda": filtervalue.trim().toLowerCase()
       };

         this.filters.pageNumber = 0;
         this.pageIndex = this.filters.pageNumber;
         this.GetCeEvaluacionEtapa2All(this.filters);
       });

  }

  private GetCeEvaluacionEtapa2All(filter: TablePaginatorSearch) {
    this.dataSource.data = [];
    this.data = [];

    if (!this.visualizarInformacionEtapa()) { // si no es etapado no llama a la api
      console.log('No consultará etapa2');
      return; 
    }

    this.EvaCService.getCeEvaluacionEtapa2All(filter, this.indicadorCapura.CicloEvaluacionInfo.cicloEvaluacionId).subscribe((response) => {
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
        let infomacionLectura  = { indicadorLeido : response.output.indicadorLeido,obligadoLeerIndicador:response.output.obligadoLeerIndicador};
        this.actualizaLecturaIndicadorInfo.emit(infomacionLectura);
      } else {
      }
    });
  }
  paginatorChange(event: PageEvent): void {
    this.filters.pageSize = event.pageSize;
    this.filters.pageNumber = event.pageIndex;
    this.GetCeEvaluacionEtapa2All(this.filters);
  }


  captureData(row: any) {
    row.infoindicador = this.indicadorCapura; // se agreaga la infomacion de headers al objeto any
    row.esVista = false;
    row.puedeAutorizar = false;
    this.dialog.open<ModalEvidenceCaptureComponent>(ModalEvidenceCaptureComponent, {
      panelClass: '',
      data: row || null,
      width: '70vw',
      minWidth: '70vw',
      maxHeight: '90vh',
    }).afterClosed().subscribe((result:any) => 
      {
          this.GetCeEvaluacionEtapa2All(this.filters)
      } 
    );
  }

  viewGoal(row: any) {
    row.infoindicador = this.indicadorCapura; // se agreaga la infomacion de headers al objeto any
    row.esVista = true;
    row.puedeAutorizar = false;
    this.dialog.open<ModalEvidenceCaptureComponent>(ModalEvidenceCaptureComponent, {
      panelClass: '',
      data: row || null,
      width: '70vw',
      minWidth: '70vw',
      maxHeight: '90vh',
    }).afterClosed().subscribe((result:any) => 
      {
          this.GetCeEvaluacionEtapa2All(this.filters)
      } 
    );
  }

  obtenerTextoMisevidencias(row : any)
  {

    let texto = '';
    // evidenciaData.evidenciaArchivos && evidenciaData.evidenciaArchivos.length
    // this.evidenciaData.evidenciaUrls
    if (row.evidenciaArchivos.length  > 0 ){
      texto =  'Archivos :' + row.evidenciaArchivos.length;
    }

    if (row.evidenciaUrls && row.evidenciaUrls.length  > 0 ){
      if (texto == ''){
        texto = texto + 'URLs :' + row.evidenciaUrls.length;
      }
      else{
        texto = texto +  ' | URLs :' + row.evidenciaUrls.length;
      }
    }

    return texto;

  }

  puedeVisualizarEditar(element: any) {
    this.visualizarInformacionEtapa();
    if (this.soloVisualiza || element.estatusEtapa == EstatusEtapa2Evidencias.naautorizado) {
      return false;
    }

    return true;
  }


  puedeVisualizarEditarDeshabilitado(element: any) 
  { 
    this.visualizarInformacionEtapa();
    if (this.soloVisualiza) {
      return false;
    }
    
    if ((element.estatusEtapa != EstatusEtapa2Evidencias.naautorizado)) {
      return false;
    }

    return true;
  }

  
  visualizarInformacionEtapa(): boolean {
    
    let numeroEtapa = 2
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

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchsub$.next(filterValue);
  }


}
