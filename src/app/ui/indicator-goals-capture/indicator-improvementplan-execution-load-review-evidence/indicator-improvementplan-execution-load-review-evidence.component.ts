import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable, Subject, debounceTime, distinctUntilChanged, of } from 'rxjs';
import { EvaluationCycleService, UsersService } from 'src/app/core/services';
import { BasicNotification } from 'src/app/utils/helpers/basicNotification';
import { IndexedDbHelper } from 'src/app/utils/helpers';
import { TablePaginatorSearch, Vista } from 'src/app/utils/models';
import { CEIndicadorEtapa1CampusDto } from 'src/app/utils/models/ceindicador-etapa1-campus.dto';
import { ModalRevisorComponent } from '../indicador-goals-capture-controls/modal-revisor/modal-revisor.component';
import { MatDialog } from '@angular/material/dialog';
import { PermisosHeredadosDTO } from 'src/app/utils/models/permisos-heredados.dto';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { ModalEvidenceAcceptComponent } from '../indicador-goals-capture-controls/modal-evidence-accept/modal-evidence-accept.component';

export class CeIndicadoresEtapasParamsModel {
  campusIds: number[] | null;
  areaResponsableIds: number[] | null;
  indicadorTipoResultado: number | null;
  nivelModalidadIds: number[] | null;
  subAreaCentralIds: number[] | null;
  avanceCompleto: boolean | null;
  estatusEtapaIds: number[] | null;
}


@Component({
  selector: 'app-indicator-improvementplan-execution-load-review-evidence',
  templateUrl: './indicator-improvementplan-execution-load-review-evidence.component.html',
  styleUrls: ['./indicator-improvementplan-execution-load-review-evidence.component.scss']
})
export class IndicatorImprovementplanExecutionLoadReviewEvidenceComponent {
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
  avance: any;
  tipo: any;
  //
  cc: any;
  newData: any[];
  revIns: any;
  tipoPantalla = 1; // 1 Carga Plan de mejora 2 Autoriza plan mejora
  fpmArchivoId = 0 // formato de descarga
  fpmNombreArchivo = ''
  constructor(private readonly EvaCService: EvaluationCycleService,
    private basicNotification: BasicNotification,
    private router: Router,
    private users: UsersService,
    private dialog: MatDialog,
    private ref: ChangeDetectorRef,
    private access: Vista,
    private activatedRoute: ActivatedRoute
  ) {
    this.tipoVista = this.users.userSession.tipoRol;
    this.dataSource = new MatTableDataSource<CEIndicadorEtapa1CampusDto>;
  }


  ngOnInit(): void {

    this.setPermissions();

    this.configuraFiltros().subscribe(filtros => {
      this.filters = filtros;
      this.getAllCicloEvaIndicadores(this.filters);
    })

    this.searchsub$.pipe(debounceTime(300), distinctUntilChanged()).subscribe((filtervalue: string) => {
      this.filters.filter.textoBusqueda = null;
      if (filtervalue) {
        this.filters.filter.textoBusqueda = filtervalue.trim().toLowerCase().replace('consolidada','');
      }
      this.getAllCicloEvaIndicadores(this.filters);
    });

  }

  private configuraFiltros(parametros : any = null): Observable<TablePaginatorSearch> {

    this.cicloEva = this.EvaCService.obtenerDatosDeStorageCicloEvaluacion();
    let filtro = new TablePaginatorSearch();
    filtro.pageSize = 25;
    filtro.pageNumber = 0;

    filtro.filter = {
      "cicloEvaluacionId": this.cicloEva.cicloEvaluacionId,
      "UsuarioId": this.users.userSession.id,
      "Activo": true,
      "textoBusqueda": null,
      "parametros": parametros
    };

    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.tipoPantalla = params['vw']; // obtiene lavista que va a utilizar
    });

    return of(filtro)
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchsub$.next(filterValue);
  }


  private getAllCicloEvaIndicadores(filter: TablePaginatorSearch) {
    this.dataSource.data = [];
    this.data = [];
    // Consulta apis para llenar datos
    if (this.tipoPantalla == 1)// Carga evidencia
    {
      this.obtenerDatosParaCargaEvidencia(filter);
    }
    else // revisa
    {
      // this.obtenerDatosParaAutorizacion(filter)
    }
  }

  private obtenerDatosParaCargaEvidencia(filter: TablePaginatorSearch) {
    if (filter?.filter)
    {
        filter.filter.isAllAreas = this.users.userSession.isAllAreas;
    }
    console.log(filter);
    this.EvaCService.getCeEtapa6ECampusVw1(filter).subscribe((response) => {
      if (response.output) {
        this.data = response.output.indicadoresEtapas.map((indicadorCiclo: any) => new CEIndicadorEtapa1CampusDto().deserialize(indicadorCiclo));
        this.newData = this.data.map((obj, index) => {
          return { ...obj, id: index + 1 };
        });
        this.fpmArchivoId = !response.output.fpmArchivoId ? 0 : response.output.fpmArchivoId; // asignar id de descarga para el formato 
        this.dataSource.data = this.newData;
        // IndexedDbHelper.saveDB(this.newData, this.basicNotification);
        // this.revIns = JSON.parse(localStorage.getItem("revIns"));
        let arrAreaCentral = this.data.filter(x => x.subAreaCentral != null);
        if (this.users.userSession.tipoRol == 2) {
          this.esUsuarioACentral = true
        }

        this.pageIndex = response.paginacion.pagina;
        this.pageSize = response.paginacion.registros;
        this.length = response.paginacion.count;

        this.avanceGlobal = response.output.avanceGlobal ?? 0;
        this.fpmArchivoId = response.output.fpmArchivoId;
        this.fpmNombreArchivo = response.output.fpmNombreArchivo;
        localStorage.setItem("avanceJson", JSON.stringify(this.avanceGlobal));
        this.cc = '';
      } else {
        // this.basicNotification.notif("error", 'La evaluación No se genero');
      }
    });
  }

  private obtenerDatosParaAutorizacion(filter: TablePaginatorSearch) {
    this.EvaCService.getCeEtapa6CampusDepAreaVw1(filter).subscribe((response) => {
      if (response.output) {
        this.data = response.output.indicadoresEtapas.map((indicadorCiclo: any) => new CEIndicadorEtapa1CampusDto().deserialize(indicadorCiclo));
        this.newData = this.data.map((obj, index) => {
          return { ...obj, id: index + 1 };
        });
        console.log(' obtenerDatosParaAutorizacion filter', filter)
        console.log(' obtenerDatosParaAutorizacion response', response)
        this.dataSource.data = this.newData; //console.log(this.dataSource.data);
        IndexedDbHelper.saveDB(this.newData, this.basicNotification); //this.saveDB();  
        this.revIns = JSON.parse(localStorage.getItem("revIns"));
        let arrAreaCentral = this.data.filter(x => x.subAreaCentral != null);

        if (arrAreaCentral.length > 0) {
          this.esUsuarioACentral = true
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


  paginatorChange(event: PageEvent): void {
    this.filters.pageSize = event.pageSize;
    this.filters.pageNumber = event.pageIndex;
    this.getAllCicloEvaIndicadores(this.filters);
  }

  showHide() {
    this.toogle = !this.toogle;
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
    row.etapa = 2;
    row.E6PM = false;
    row.infoEvaluacion = this.cicloEva; // se agreaga la infomacion de headers al objeto any
    this.dialog.open<ModalRevisorComponent>(ModalRevisorComponent, {
      panelClass: '',
      data: row || null,
      width: '50vw',
      minWidth: '50vw',
      maxHeight: '90vh',
    }).afterClosed().subscribe((result: any) => {
      if (result) {
        this.getAllCicloEvaIndicadores(this.filters);
      }
    });
  }

  viewData(row: any) {
    row.etapa = 2;
    row.infoEvaluacion = this.cicloEva;
    row.CicloEvaluacionInfo = this.cicloEva;
    row.campusId = row.campusId;
    row.AreaResponsableid = row.areaId;
    row.soloVisualiza = true;
    row.esAutorizadorNa = false;
    localStorage.setItem('indicadorcaptura', JSON.stringify(row));
    const Url = "indicator-goals-capture/detailindicator";
    window.location.assign(Url);
    //this.router.navigateByUrl('indicator-goals-capture/detailindicator');
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

  btnCleanFilters(c: any) {
    this.cc = c; //console.log(this.cc);
  }

  obtenerTextoEtapa() {
    return `${this.cicloEva.cicloEvaluacion} | Etapa 6`
  }


  funcionaAceptarEvidencia(row: any) {
    row.infoEvaluacion = this.cicloEva; // se agreaga la infomacion de headers al objeto any
    row.etapa = 2;
    if (this.esAutorizadorNa && this.esUsuarioACentral) {
      this.dialog.open<ModalEvidenceAcceptComponent>(ModalEvidenceAcceptComponent, {
        panelClass: '',
        data: row || null,
        width: '70vw',
        minWidth: '70vw',
        maxHeight: '90vh',
      }).afterClosed().subscribe((result: any) => {
        if (result) {
          this.getAllCicloEvaIndicadores(this.filters);
        }
      }
      );
    }
  }

  descargaFormatoPm() {
    this.dataSource
  }

  cargaArchivo(event: any) {
    this.getAllCicloEvaIndicadores(this.filters);
  }

  eliminaArchivo(event: any) {
    this.getAllCicloEvaIndicadores(this.filters);
  }

  autorizaPmClm(event: any) {
    this.getAllCicloEvaIndicadores(this.filters);
  }
}
