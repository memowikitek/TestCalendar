import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { EvaluationCycleService, UsersService } from 'src/app/core/services';
import { BasicNotification } from 'src/app/utils/helpers/basicNotification';
import { Alert, IndexedDbHelper } from 'src/app/utils/helpers';
import { TablePaginatorSearch, Vista } from 'src/app/utils/models';
import { CEIndicadorEtapa1CampusDto } from 'src/app/utils/models/ceindicador-etapa1-campus.dto';
// import { ModalAutorizeNaIndicatorComponent } from './indicador-goals-capture-controls/modal-autorize-na-indicator/modal-autorize-na-indicator.component';
import { ModalRevisorComponent } from '../indicador-goals-capture-controls/modal-revisor/modal-revisor.component';
import { MatDialog } from '@angular/material/dialog';
import { PermisosHeredadosDTO } from 'src/app/utils/models/permisos-heredados.dto';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { ModalAutorizeNaAutoevaluationComponent } from '../indicador-goals-capture-controls/modal-autorize-na-autoevaluation/modal-autorize-na-autoevaluation.component';
import { ModalAutorizeNaAutoevaluationreviewComponent } from '../indicador-goals-capture-controls/modal-autorize-na-autoevaluationreview/modal-autorize-na-autoevaluationreview.component';

export class CeIndicadoresEtapasParamsModel {
  campusIds: number[] | null;
  areaResponsableIds: number[] | null;
  indicadorTipoResultado: number | null;
  nivelModalidadIds: number[] | null;
  subAreaCentralIds: number[] | null;
  avanceCompleto: boolean | null;
  estatusEtapaIds: number[] | null;
  sesionRetro: boolean | null;
  estatusRiIds: number[] | null;
}

@Component({
  selector: 'app-indicator-ri-e6pmdri',
  templateUrl: './indicator-ri-e6pmdri.component.html',
  styleUrls: ['./indicator-ri-e6pmdri.component.scss']
})
export class IndicatorRiE6pmdriComponent {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  @ViewChild('input', { static: true }) inputSearch: ElementRef;
  @ViewChild('paginator', { static: true }) readonly paginator: MatPaginator;

  data: CEIndicadorEtapa1CampusDto[];
  dataSource: MatTableDataSource<CEIndicadorEtapa1CampusDto>;
  filters: TablePaginatorSearch;
  pageIndex: number;
  pageSize: number;
  length: number;
  cicloEva: any;
  avanceGlobal = 0
  toogle: boolean = false;
  private searchsub$ = new Subject<string>();
  columns = ['nombreCampus', 'area', 'retroalimentacion', 'estatusDescripcion', 'edit', 'estatusRI', 'usuarioRevisor'];
  tipoVista = 1 // Predeterminado para la vista usuario 1

  esUsuarioACentral = false;
  esAutorizadorNa = true;
  permissions: string[];
  //Campos
  campus: any;
  areaResp: any;
  subAreaC: any;
  nivelMod: any;
  estatus: any;
  estatusRi: any;
  avance: any;
  tipo: any;
  sesionRetro: any
  //
  cc: any;
  newData: any[];
  revIns: any;

  numeroEtapa = 9; // sirve para referenciar la estaba en la pantalla de detalles
  esvista = true; // predeterminado porque asi se visualiza para un usuario campus 

  constructor(private readonly EvaCService: EvaluationCycleService,
    private basicNotification: BasicNotification,
    private router: Router,
    private users: UsersService,
    private dialog: MatDialog,
    private ref: ChangeDetectorRef,
    private access: Vista
  ) {
    this.tipoVista = this.users.userSession.tipoRol;
    this.dataSource = new MatTableDataSource<CEIndicadorEtapa1CampusDto>;
    
    if (this.users.userSession.tipoRol == 2) // si es usuario de area centrar se desactivael solo vista para que autorice NA
    {
      this.esvista = false
    }

  }

  obtenerDatosDeStorage(): any {
    let datoStorage = JSON.parse(localStorage.getItem('cycleStage'));
    if (datoStorage[0]) {
      if (datoStorage[0].etapaEvaluacion) {
        if (datoStorage[0].etapaEvaluacion.length > 0) {
          datoStorage[0].fechaInicio = datoStorage[0].etapaEvaluacion[0].fechaInicio;
          datoStorage[0].fechaFin = datoStorage[0].etapaEvaluacion[0].fechaFin;
        }
      }
    }

    return datoStorage[0];
  }

  ngOnInit(): void {
    this.setPermissions();
    this.esAutorizadorNa = this.checkPermission('ANA')
    this.cicloEva = this.obtenerDatosDeStorage();
    this.filters = new TablePaginatorSearch();
    this.filters.pageSize = 25;
    this.filters.pageNumber = 0;
    this.filters.filter = {
      "cicloEvaluacionId": this.cicloEva.cicloEvaluacionId,
      "UsuarioId": this.users.userSession.id,
      "Activo": true,
      "textoBusqueda": null
    };

    this.getAllCicloEvaIndicadores(this.filters);

    this.searchsub$.pipe(debounceTime(300), distinctUntilChanged()).subscribe((filtervalue: string) => {

      if (!(this.filters.filter.parametros)){
        this.filters.filter = { // no tiene parametros establecidos
          "cicloEvaluacionId": this.cicloEva.cicloEvaluacionId,
          "UsuarioId": this.users.userSession.id,
          "Activo": true,
          "textoBusqueda": filtervalue.trim().toLowerCase(),
        };
      }
      else
      { // si tiene parametros establecidos
        this.filters.filter = {
          "cicloEvaluacionId": this.cicloEva.cicloEvaluacionId,
          "UsuarioId": this.users.userSession.id,
          "Activo": true,
          "textoBusqueda": filtervalue.trim().toLowerCase(),
          "parametros": this.filters.filter.parametros
        };
      }

      this.filters.pageNumber = 0;
      this.pageIndex = this.filters.pageNumber;
      this.getAllCicloEvaIndicadores(this.filters);
    });

    if (this.esUsuarioACentral) {
      this.columns = ['nombreCampus', 'area', 'indicadorTipoResultado', 'nivelModalidad', 'claveNombreElemento', 'nombreIndicador', 'subAreaCentral', 'select', 'estatusDescripcion', 'edit','estatusRI'];
    }
  }


  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchsub$.next(filterValue);
  }

  private getAllCicloEvaIndicadores(filter: TablePaginatorSearch) {
    this.dataSource.data = [];
    this.data = [];
    this.EvaCService.getCeIndicadoresEtapa6PMDRI(filter).subscribe((response) => {
      if (response.output) {//console.log("response grid principal",response);
        this.data = response.output.indicadoresEtapas.map((indicadorCiclo: any) => new CEIndicadorEtapa1CampusDto().deserialize(indicadorCiclo));
        this.dataSource.data = this.data;
        this.newData = this.data.map((obj, index) => {
          return { ...obj, id: index + 1 };
        }); console.log('newData',this.newData);
        this.dataSource.data = this.newData; //console.log(this.dataSource.data);
        IndexedDbHelper.saveDB(this.newData,this.basicNotification);  //this.saveDB();
        this.revIns = JSON.parse(localStorage.getItem("revIns"));
        let arrAreaCentral = this.data.filter(x => x.subAreaCentral != null);
        if (arrAreaCentral.length > 0) {
          this.esUsuarioACentral = true 
          this.columns = (this.revIns) ? ['nombreCampus', 'area', 'estatusDescripcion', 'edit', 'estatusRI', 'usuarioRevisor']:['nombreCampus', 'area', 'estatusDescripcion', 'edit', 'estatusRI', 'usuarioRevisor'];
        }

        this.pageIndex = response.paginacion.pagina;
        this.pageSize = response.paginacion.registros;
        this.length = response.paginacion.count;

        this.avanceGlobal = response.output.avanceGlobal ?? 0;
        localStorage.setItem("avanceJson", JSON.stringify(this.avanceGlobal));

        this.cc = '';
        // this.basicNotification.notif("success", 'Evaluación generada correctamente');
      } else {
        // this.basicNotification.notif("error", 'La evaluación No se genero');
      }
    });
  }

  paginatorChange(event: PageEvent): void {;
    this.filters.pageSize = event.pageSize;
    this.filters.pageNumber = event.pageIndex;
    this.getAllCicloEvaIndicadores(this.filters);
  }

  showHide() {
    this.toogle = !this.toogle;
  }


  captureData(row: any) {
    row.infoEvaluacion = this.cicloEva; // se agreaga la infomacion de headers al objeto any
    row.etapa = this.numeroEtapa;
    if (this.esAutorizadorNa && this.esUsuarioACentral) {
      this.dialog.open<ModalAutorizeNaAutoevaluationreviewComponent>(ModalAutorizeNaAutoevaluationreviewComponent, {
        panelClass: '',
        data: row || null,
        width: '50vw',
        minWidth: '50vw',
        maxHeight: '90vh',
      }).afterClosed().subscribe((result: any) => {
        if (result) {
          this.getAllCicloEvaIndicadores(this.filters);
        }
      }
      );
    }
    else {
      row.CicloEvaluacionInfo = this.cicloEva;
      row.etapa = this.numeroEtapa;
      row.soloVisualiza = false;
      row.esAutorizadorNa = this.esAutorizadorNa;
      row.AreaResponsableid = row.areaId;
      row.campusId = row.campusId;
      localStorage.setItem('indicadorcaptura', JSON.stringify(row));
      const Url = "indicator-goals-capture/detailindicator";
      window.location.assign(Url);
      //this.router.navigateByUrl('indicator-goals-capture/detailindicator');
    }
  }

  setPermisosHeredados(urlRedirect: string) {
    var permiso = new PermisosHeredadosDTO();
    permiso.vistaPadre = "/mis-evaluaciones";
    permiso.vistaHijo = urlRedirect;

    var permisosHeredados: PermisosHeredadosDTO[] = JSON.parse(localStorage.getItem('permisosHeredados'));
    if (permisosHeredados == null) {
      permisosHeredados = [];
      permisosHeredados.push(permiso);
    } else {
      var permisoFind = permisosHeredados.find(p => p.vistaHijo == urlRedirect)
      if (permisoFind == null) {
        permisosHeredados.push(permiso);
      }
    }
    localStorage.setItem('permisosHeredados', JSON.stringify(permisosHeredados));
  }

  captureRevisor(row: any) {
    row.etapa = 9;
    row.E6PM = true;//TRUE PARA PM
    row.infoEvaluacion = this.cicloEva; // se agreaga la infomacion de headers al objeto any
    this.dialog.open<ModalRevisorComponent>(ModalRevisorComponent, {
      panelClass: '',
      data: row || null,
      width: '65vw',
      minWidth: '65vw',
      maxHeight: '90vh',
    }).afterClosed().subscribe((result: any) => {
      if (result) {
        this.getAllCicloEvaIndicadores(this.filters);
      }
    });
  }

  viewData(row: any) 
  {
    row.etapa = this.numeroEtapa;
    row.CicloEvaluacionInfo = this.cicloEva;
    row.infoEvaluacion = this.cicloEva;
    row.campusId = row.campusId;
    row.AreaResponsableid = row.areaId;
    row.soloVisualiza = true;
    row.esAutorizadorNa = false;
    localStorage.setItem('indicadorcaptura', JSON.stringify(row));
    const Url = "indicator-goals-capture/detailindicator";
    window.location.assign(Url);
  }

  private setPermissions(): void {
    this.permissions = []
    var permisolHeredadoList: PermisosHeredadosDTO[] = JSON.parse(localStorage.getItem('permisosHeredados'));
    var permisolHeredado = permisolHeredadoList.find(p => p.vistaHijo == this.router.url)
    this.permissions = this.access.getPermissionsV2(this.users.userSession.permisosRolesVistas, permisolHeredado.vistaPadre);
  }

  checkPermission(p: string): boolean {
    return this.permissions?.some(r => r.trim() == p.trim())
  }

  aplicarParametros(events: any) { //console.log(events);

     let parametros = new CeIndicadoresEtapasParamsModel();
    if (events.NombreCampus) {
      parametros.campusIds = events.NombreCampus;
    }

    if (events.NombreArea) {
      parametros.areaResponsableIds = events.NombreArea;
    }

    if (events.IndicadorTipoResultado) {
      parametros.indicadorTipoResultado = events.IndicadorTipoResultado[0];
    }

    if (events.NivelModalidad) {
      parametros.nivelModalidadIds = events.NivelModalidad;
    }

    if (events.Avance) {
      parametros.avanceCompleto = events.Avance == 100 ? true : false;
    }

    if (events.EstatusCaptura) {
      parametros.estatusEtapaIds = events.EstatusCaptura;
    }
    
    if (events.SubAreaCentral) {
      parametros.subAreaCentralIds = events.SubAreaCentral;
    }

    if (events.EstatusRi) {
      parametros.estatusRiIds = events.EstatusRi;
    }

    if (events.SesionRetro) {
      parametros.sesionRetro = events.SesionRetro;
    }

    let textoBusqueda = null; 
    if (this.inputSearch.nativeElement){
      textoBusqueda = this.inputSearch.nativeElement.value.trim()
    }

    this.campus = parametros.campusIds != undefined;
    this.areaResp = parametros.areaResponsableIds != undefined;
    this.subAreaC = parametros.subAreaCentralIds != undefined;
    this.nivelMod = parametros.nivelModalidadIds != undefined;
    this.estatus = parametros.estatusEtapaIds != undefined;
    this.estatusRi = parametros.estatusRiIds != undefined;
    this.sesionRetro = parametros.sesionRetro != undefined;
    //campus
    this.avance = parametros.avanceCompleto != undefined;
    this.tipo = parametros.indicadorTipoResultado != undefined;
    //console.log('parametros',parametros);
    if (textoBusqueda == null){
      this.filters.filter = {
        "cicloEvaluacionId": this.cicloEva.cicloEvaluacionId,
        "UsuarioId": this.users.userSession.id,
        "Activo": true,
        "parametros": parametros
        // "textoBusqueda": this.inputSearch.nativeElement filtervalue.trim().toLowerCase(),
        // nombreArea: filtervalue.trim().toLowerCase(),
      };
    }
    else{
      this.filters.filter = {
        "cicloEvaluacionId": this.cicloEva.cicloEvaluacionId,
        "UsuarioId": this.users.userSession.id,
        "Activo": true,
        "parametros": parametros,
        "textoBusqueda": textoBusqueda
      };
    }

    
    this.getAllCicloEvaIndicadores(this.filters);
  }

  btnCleanFilters(c:any){
    this.cc = c; //console.log(this.cc);
  }

  funcionVerComentario(row : any ){
      if (row.comentarioRetro){
          Alert.info("Comentario de retroalimentación",row.comentarioRetro,);
      }
  }

  obtenerTextoEtapa() {
    return `${this.cicloEva.cicloEvaluacion} | Etapa 6`
  }

}
