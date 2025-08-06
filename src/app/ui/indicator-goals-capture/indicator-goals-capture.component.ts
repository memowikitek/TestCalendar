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
import { ModalAutorizeNaIndicatorComponent } from './indicador-goals-capture-controls/modal-autorize-na-indicator/modal-autorize-na-indicator.component';
import { ModalRevisorComponent } from './indicador-goals-capture-controls/modal-revisor/modal-revisor.component';
import { MatDialog } from '@angular/material/dialog';
import { PermisosHeredadosDTO } from 'src/app/utils/models/permisos-heredados.dto';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { FormBuilder, FormGroup } from '@angular/forms';

export class CeIndicadoresEtapasParamsModel {
  campusIds: number[] | null;
  areaResponsableIds: number[] | null;
  indicadorTipoResultado: number | null;
  nivelModalidadIds: number[] | null;
  subAreaCentralIds: number[] | null;
  avanceCompleto: boolean | null;
  estatusEtapaIds: number[] | null;
  estatusRiIds: number[] | null;
}

@Component({
  selector: 'app-indicator-goals-capture',
  templateUrl: './indicator-goals-capture.component.html',
  styleUrls: ['./indicator-goals-capture.component.scss']
})
export class IndicatorGoalsCaptureComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  @ViewChild('input', { static: true }) inputSearch: ElementRef;
  @ViewChild('paginator', { static: true }) readonly paginator: MatPaginator;

  cicloFilterForm: FormGroup;
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
  columns = ['nombreCampus', 'area', 'indicadorTipoResultado', 'nivelModalidad', 'claveNombreElemento', 'nombreIndicador', 'select', 'edit'];
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
  //
  cc: any;
  newData: any[];
  revIns: any;
  tipoRol: any;
  areasResponsablesArr: any;
  campusArr: any;

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
    this.tipoRol = users.userSession.tipoRol; 
    if(this.tipoRol == 1){
      this.areasResponsablesArr = this.users.userSession.areasResponsablesIds.split(',').map(id => parseInt(id.trim(), 10));
      this.campusArr = this.users.userSession.campusIds.split(',').map(id => parseInt(id.trim(), 10));      
    }
    //console.log('User:',this.areasResponsablesArr, this.campusArr);
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
    this.esAutorizadorNa = this.checkPermission('ANA');
    this.cicloEva = this.obtenerDatosDeStorage();
    this.filters = new TablePaginatorSearch();
    this.filters.pageSize = 25;
    this.filters.pageNumber = 0;
    
    this.revIns = JSON.parse(localStorage.getItem("revIns"));
    /*if(this.tipoRol == 1 && this.revIns){
      this.filters.filter = {
        "CicloEvaluacionId": this.cicloEva.cicloEvaluacionId, 
        "AreaResponsableId": this.areasResponsablesArr, 
        "CampusId": this.campusArr,
        "Activo": true,
        "textoBusqueda": null
      };
      this.getCeEvaluacionE7Ri(this.filters);
    }else{*/
      this.filters.filter = {
        "cicloEvaluacionId": this.cicloEva.cicloEvaluacionId,
        "UsuarioId": this.users.userSession.id,
        "Activo": true,
        "textoBusqueda": null,
        "IsAllAreas": this.users.userSession.isAllAreas

      };
      this.getAllCicloEvaIndicadores(this.filters);
    //}

    this.searchsub$.pipe(debounceTime(300), distinctUntilChanged()).subscribe((filtervalue: string) => {
      this.filters.pageNumber = 0;
      this.pageIndex = this.filters.pageNumber;
      /*if(this.tipoRol == 1 && this.revIns){
        if (!(this.filters.filter.parametros)){
          this.filters.filter = {
            "CicloEvaluacionId": this.cicloEva.cicloEvaluacionId, 
            "AreaResponsableId": this.areasResponsablesArr, 
            "CampusId": this.campusArr,
            "Activo": true,
            "textoBusqueda": filtervalue.trim().toLowerCase()
          };
        }else{
          this.filters.filter = {
            "CicloEvaluacionId": this.cicloEva.cicloEvaluacionId, 
            "AreaResponsableId": this.areasResponsablesArr, 
            "CampusId": this.campusArr,
            "Activo": true,
            "textoBusqueda": filtervalue.trim().toLowerCase(),
            "parametros": this.filters.filter.parametros
          };
        }
        this.getCeEvaluacionE7Ri(this.filters);
      }else{*/
        if (!(this.filters.filter.parametros)){
          this.filters.filter = { // no tiene parametros establecidos
            "cicloEvaluacionId": this.cicloEva.cicloEvaluacionId,
            "UsuarioId": this.users.userSession.id,
            "Activo": true,
            "textoBusqueda": filtervalue.trim().toLowerCase(),
            "IsAllAreas": this.users.userSession.isAllAreas
          };
        }else{ 
          // si tiene parametros establecidos
          this.filters.filter = {
            "cicloEvaluacionId": this.cicloEva.cicloEvaluacionId,
            "UsuarioId": this.users.userSession.id,
            "Activo": true,
            "textoBusqueda": filtervalue.trim().toLowerCase(),
            "parametros": this.filters.filter.parametros,
            "IsAllAreas": this.users.userSession.isAllAreas
          };
        }
        this.getAllCicloEvaIndicadores(this.filters);
      //}

    });

    if (this.esUsuarioACentral) {
      this.columns = ['nombreCampus', 'area', 'indicadorTipoResultado', 'nivelModalidad', 'claveNombreElemento', 'nombreIndicador', 'subAreaCentral', 'select', 'estatusDescripcion', 'edit'];
    }
  }


  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchsub$.next(filterValue);
  }

  private getAllCicloEvaIndicadores(filter: TablePaginatorSearch) {
    this.dataSource.data = [];
    this.data = [];
    this.EvaCService.getCEIndicadoresEtapa1(filter).subscribe((response) => {
      if (response.output) {
        this.data = response.output.indicadoresEtapas.map((indicadorCiclo: any) => new CEIndicadorEtapa1CampusDto().deserialize(indicadorCiclo));
        this.newData = this.data.map((obj, index) => {
          return { ...obj, id: index + 1 };
        }); console.log('newData',this.newData);
        this.dataSource.data = this.newData; //console.log(this.dataSource.data);
        IndexedDbHelper.saveDB(this.newData,this.basicNotification);  //this.saveDB();
        this.revIns = JSON.parse(localStorage.getItem("revIns"));
        let arrAreaCentral = this.data.filter(x => x.subAreaCentral != null);
        if (arrAreaCentral.length > 0) {
          this.esUsuarioACentral = true
          this.columns = (this.revIns) ? ['nombreCampus', 'area', 'indicadorTipoResultado', 'nivelModalidad', 'claveNombreElemento', 'nombreIndicador', 'subAreaCentral', 'estatusDescripcion', 'edit', 'estatusRI', 'usuarioRevisor'] : ['nombreCampus', 'area', 'indicadorTipoResultado', 'nivelModalidad', 'claveNombreElemento', 'nombreIndicador', 'subAreaCentral', 'estatusDescripcion', 'edit'];
        }

        this.pageIndex = response.paginacion.pagina;
        this.pageSize = response.paginacion.registros;
        this.length = response.paginacion.count;

        this.avanceGlobal = response.output.avanceGlobal ?? 0; //console.log('avanceGlobal',this.avanceGlobal);
        localStorage.setItem("avanceJson", JSON.stringify(this.avanceGlobal));

        this.cc = '';
        // this.basicNotification.notif("success", 'Evaluación generada correctamente');
      } else {
        // this.basicNotification.notif("error", 'La evaluación No se genero');
      }
    });
  }

  /*private getCeEvaluacionE7Ri(filter: TablePaginatorSearch) {
    this.dataSource.data = [];
    this.data = [];
    this.EvaCService.getCeEvaluacionE7RiWithParams(filter).subscribe((response) => {
      if (response.output) {
        this.data = response.output.map((indicadorCiclo: any) => new CEIndicadorEtapa1CampusDto().deserialize(indicadorCiclo));
        this.newData = this.data.map((obj, index) => {
          return { ...obj, id: index + 1, 
            campus: obj.nombreCampus, 
            areaResponsable: obj.nombreArea, 
            claveNombreElementoEvaluacion: obj.claveElementoEvaluacion + ' ' + obj.nombreElementoEvaluacion,
            claveNombreIndicador: obj.claveIndicador + ' ' + obj.nombreIndicador
          };
        }); console.log('newData',this.newData);
        this.dataSource.data = this.newData; //console.log(this.dataSource.data);
        //IndexedDbHelper.saveDB(this.newData,this.basicNotification);  //this.saveDB();
        this.revIns = JSON.parse(localStorage.getItem("revIns"));
        let arrAreaCentral = this.data.filter(x => x.subAreaCentral != null);
        if (arrAreaCentral.length > 0) {
          this.esUsuarioACentral = true
          this.columns = (this.revIns) ? ['nombreCampus', 'area', 'indicadorTipoResultado', 'nivelModalidad', 'claveNombreElemento', 'nombreIndicador', 'subAreaCentral', 'estatusDescripcion', 'edit', 'estatusRI', 'usuarioRevisor'] : ['nombreCampus', 'area', 'indicadorTipoResultado', 'nivelModalidad', 'claveNombreElemento', 'nombreIndicador', 'subAreaCentral', 'estatusDescripcion', 'edit'];
        }

        this.pageIndex = response.paginacion.pagina;
        this.pageSize = response.paginacion.registros;
        this.length = response.paginacion.count;

        this.cc = '';
      }
    });
  }*/

  paginatorChange(event: PageEvent): void {
    this.filters.pageSize = event.pageSize;
    this.filters.pageNumber = event.pageIndex;
    this.getAllCicloEvaIndicadores(this.filters);
  }

  showHide() {
    this.toogle = !this.toogle;
  }


  captureData(row: any) 
  {
    if (row.esAreaConsolidada)
    {
      Alert.confirmAreaConsolidada('Área consolidada','Tu dependencia de área realizará la captura de metas. Puedes conocer tus indicadores y consultar tus datos.')
      .subscribe(resp =>
      {
        ///////Siempre va a visualizar si es area consolidada///////// 
        this.viewData(row);
        ////////////////
      });
    }
    else // ciclo normal 
    {
      row.etapa = 1;
      row.infoEvaluacion = this.cicloEva; // se agreaga la infomacion de headers al objeto any
      if (this.esAutorizadorNa && this.esUsuarioACentral) {
        this.dialog.open<ModalAutorizeNaIndicatorComponent>(ModalAutorizeNaIndicatorComponent, {
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
        row.etapa = 1;
        row.CicloEvaluacionInfo = this.cicloEva;
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
  }

  captureRevisor(row: any) {
    row.etapa = 1;
    row.E6PM = false;
    row.infoEvaluacion = this.cicloEva; // se agreaga la infomacion de headers al objeto any
    row.esVista = this.tipoRol == 1 && this.revIns;
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


  viewData(row: any) { //console.log('GRID:',row,this.cicloEva);
    row.etapa = 1;
    row.infoEvaluacion = this.cicloEva;
    row.CicloEvaluacionInfo = this.cicloEva;
    row.campusId = row.campusId;
    row.AreaResponsableid = row.areaId;
    row.soloVisualiza = true;
    row.esAutorizadorNa = this.esAutorizadorNa;
    localStorage.setItem('indicadorcaptura', JSON.stringify(row));
    const Url = "indicator-goals-capture/detailindicator";
    window.location.assign(Url);
    //this.router.navigateByUrl('indicator-goals-capture/detailindicator');
  }

  private setPermissions(): void {
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

    let textoBusqueda = null;
    if (this.inputSearch.nativeElement) {
      textoBusqueda = this.inputSearch.nativeElement.value.trim()
    }

    this.campus = parametros.campusIds != undefined;
    this.areaResp = parametros.areaResponsableIds != undefined;
    this.subAreaC = parametros.subAreaCentralIds != undefined;
    this.nivelMod = parametros.nivelModalidadIds != undefined;
    this.estatus = parametros.estatusEtapaIds != undefined;
    this.estatusRi = parametros.estatusRiIds != undefined;
    //campus
    this.avance = parametros.avanceCompleto != undefined;
    this.tipo = parametros.indicadorTipoResultado != undefined;

    if (textoBusqueda == null) {
      this.filters.filter = {
        "cicloEvaluacionId": this.cicloEva.cicloEvaluacionId,
        "UsuarioId": this.users.userSession.id,
        "Activo": true,
        "parametros": parametros,
        "IsAllAreas": this.users.userSession.isAllAreas
        // "textoBusqueda": this.inputSearch.nativeElement filtervalue.trim().toLowerCase(),
        // nombreArea: filtervalue.trim().toLowerCase(),
      };
    }
    else {
      this.filters.filter = {
        "cicloEvaluacionId": this.cicloEva.cicloEvaluacionId,
        "UsuarioId": this.users.userSession.id,
        "Activo": true,
        "parametros": parametros,
        "textoBusqueda": textoBusqueda,
        "IsAllAreas": this.users.userSession.isAllAreas
      };
    }


    this.getAllCicloEvaIndicadores(this.filters);
  }

  btnCleanFilters(c: any) {
    this.cc = c; console.log(this.cc);
  }

  obtenerTextoEtapa() {
    return `${this.cicloEva.cicloEvaluacion} | Etapa 1`
  }

  
}
