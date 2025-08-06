import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
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
import saveAs from 'file-saver';

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
  selector: 'app-indicator-improvement-plan-design-capture',
  templateUrl: './indicator-improvement-plan-design-capture.component.html',
  styleUrls: ['./indicator-improvement-plan-design-capture.component.scss']
})
export class IndicatorImprovementPlanDesignCaptureComponent {
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
  validarAutorizacion: boolean = true;

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

    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.tipoPantalla = params['vw']; // obtiene lavista que va a utilizar
      this.getAllCicloEvaIndicadores(this.filters);  
    });

    

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
  }


  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchsub$.next(filterValue);
  }


  private getAllCicloEvaIndicadores(filter: TablePaginatorSearch) {
    this.dataSource.data = [];
    this.data = [];
    // Consulta apis para llenar datos
    if (this.tipoPantalla == 1)// Carga PM
    {
      this.obtenerDatosPM(filter);
    }
    else // autoriza
    {
      this.obtenerDatosParaAutorizacion(filter)
    }
  }

  private obtenerDatosPM(filter: TablePaginatorSearch)
  {
    if (filter?.filter)
    {
        filter.filter.isAllAreas = this.users.userSession.isAllAreas;
    }
    this.EvaCService.getCeEtapa6CampusVw1(filter).subscribe((response) => {
      if (response.output) {
        this.data = response.output.indicadoresEtapas.map((indicadorCiclo: any) => new CEIndicadorEtapa1CampusDto().deserialize(indicadorCiclo));
        this.newData = this.data.map((obj, index) => {
          return { ...obj, id: index + 1 };
        });
        this.fpmArchivoId =  !response.output.fpmArchivoId ? 0 : response.output.fpmArchivoId ; // asignar id de descarga para el formato 
        this.fpmNombreArchivo = !response.output.fpmNombreArchivo ? '' : response.output.fpmNombreArchivo ;
        this.dataSource.data = this.newData; 
        IndexedDbHelper.saveDB(this.newData,this.basicNotification);  
        this.revIns = JSON.parse(localStorage.getItem("revIns"));
        let arrAreaCentral = this.data.filter(x => x.subAreaCentral != null);
        if (this.users.userSession.tipoRol == 2) {
          this.esUsuarioACentral = true
        }

        this.pageIndex = response.paginacion.pagina;
        this.pageSize = response.paginacion.registros;
        this.length = response.paginacion.count;

        this.avanceGlobal = response.output.avanceGlobal ?? 0;
        localStorage.setItem("avanceJson", JSON.stringify(this.avanceGlobal));
        this.cc = '';
      } else {
        // this.basicNotification.notif("error", 'La evaluación No se genero');
      }
    });
  }

  private obtenerDatosParaAutorizacion(filter: TablePaginatorSearch){
    if (filter?.filter)
    {
          filter.filter.isAllAreas = this.users.userSession.isAllAreas;
    }
    this.EvaCService.getCeEtapa6CampusDepAreaVw1(filter).subscribe((response) => {
      if (response.output) {
        this.data = response.output.indicadoresEtapas.map((indicadorCiclo: any) => new CEIndicadorEtapa1CampusDto().deserialize(indicadorCiclo));
        this.newData = this.data.map((obj, index) => {
          return { ...obj, id: index + 1 };
        });console.log('newData:',this.data,this.newData);
        this.validarAutorizacion = this.data.length > 0; console.log('validarAutorizacion:',this.validarAutorizacion);
        this.dataSource.data = this.newData; //console.log(this.dataSource.data);
        IndexedDbHelper.saveDB(this.newData,this.basicNotification); //this.saveDB();  
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


  paginatorChange(event: PageEvent): void {;
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

  aplicarParametros(events: any) {

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

    let textoBusqueda = null; 
    if (this.inputSearch.nativeElement){
      textoBusqueda = this.inputSearch.nativeElement.value.trim()
    }

    this.campus = parametros.campusIds != undefined;
    this.areaResp = parametros.areaResponsableIds != undefined;
    this.subAreaC = parametros.subAreaCentralIds != undefined;
    this.nivelMod = parametros.nivelModalidadIds != undefined;
    this.estatus = parametros.estatusEtapaIds != undefined;
    //campus
    this.avance = parametros.avanceCompleto != undefined;
    this.tipo = parametros.indicadorTipoResultado != undefined;

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

  obtenerTextoEtapa(){
    return  `${this.cicloEva.cicloEvaluacion} | Etapa 6`  
  }

  
  funcionaAceptarEvidencia(row: any){
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

    
  descargaFormatoPm()
  {
    if (this.tipoPantalla == 1 && this.fpmArchivoId) {
      this.EvaCService.GetAzureFileByIdFile(this.fpmArchivoId, 'formato-plan-mejora').subscribe(res => {
        var fileExt = this.fpmNombreArchivo.split('.');
        if (fileExt.length > 1) {
          saveAs(res, this.fpmNombreArchivo);
        }
      });
    }
  }
  
  cargaArchivo(event : any){
    this.getAllCicloEvaIndicadores(this.filters);
  }

  eliminaArchivo(event : any)
  {
    this.getAllCicloEvaIndicadores(this.filters);
  }

  autorizaPmClm(event : any){
    this.getAllCicloEvaIndicadores(this.filters);
  }

  descargaSugerenciaSiac()
  {
    let fl = new TablePaginatorSearch();
    
    // filtro correcto
    fl : TablePaginatorSearch;
    fl.filter = {
      "cicloEvaluacionId": this.cicloEva.cicloEvaluacionId,
      "UsuarioId": this.users.userSession.id
    };
    
    this.EvaCService.getReporteSugerenciaSiacExcel(fl).subscribe((response) => 
      {
        // Nombre predeterminado encaso que no encuentre nombre en los encabezados
        let filename = 'sugerencia_siac.xlsx'
        // Agregar esta linea en el endpoint HttpContext.Response.Headers.Add("Access-Control-Expose-Headers", "Content-Disposition");

        // Obtiene el nombre del request  
        let content_disposition = response.headers.get('content-disposition');
        if (content_disposition && content_disposition.indexOf('attachment') !== -1)
        {
          var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
          var matches = filenameRegex.exec(content_disposition);
          if (matches != null && matches[1]) { 
            filename = matches[1].replace(/['"]/g, '');
          }
        }
        // guarda
        saveAs(response.body,filename);
      });
  }
}
