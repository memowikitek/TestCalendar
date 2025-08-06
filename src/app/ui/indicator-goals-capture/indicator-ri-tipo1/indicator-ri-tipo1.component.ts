import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
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
import { FormBuilder, FormGroup } from '@angular/forms';

export class CeIndicadoresEtapasParamsModel {
  EtapaId: number[] | null;
  //AreaResponsableId: number[] | null;
  NombreArea: any[];
  NivelModalidad: any[];
}

@Component({
  selector: 'app-indicator-ri-tipo1',
  templateUrl: './indicator-ri-tipo1.component.html',
  styleUrls: ['./indicator-ri-tipo1.component.scss']
})
export class IndicatorRiTipo1Component implements OnInit {
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
  columns = ['etapa','nombreCampus', 'area',  'nivelModalidad', 'claveNombreElemento', 'nombreIndicador', 'edit'];
  tipoVista = 1 // Predeterminado para la vista usuario 1

  esUsuarioACentral = false;
  esAutorizadorNa = true;
  permissions: string[];
  //Campos
  etapas: any;
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
    let datoStorage = JSON.parse(localStorage.getItem('CE'));//JSON.parse(localStorage.getItem('cycleStage'));
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
    //this.setPermissions();
    this.cicloEva = this.obtenerDatosDeStorage(); //console.log('cicloEva:',this.cicloEva);
    this.filters = new TablePaginatorSearch();
    this.filters.pageSize = 25;
    this.filters.pageNumber = 0;
    this.revIns = JSON.parse(localStorage.getItem("revIns"));
    this.filters.filter = {
      "CicloEvaluacionId": this.cicloEva.cicloEvaluacionId, 
      "AreaResponsableId": this.areasResponsablesArr, 
      "CampusId": this.campusArr,
      "Activo": true,
      "SearchTerm": null
    };
    this.getCeEvaluacionE7Ri(this.filters);

    this.searchsub$.pipe(debounceTime(300), distinctUntilChanged()).subscribe((filtervalue: string) => {
      this.filters.pageNumber = 0;
      this.pageIndex = this.filters.pageNumber;
      //console.log('BUSQUEDA',this.tipoRol,this.revIns);
      if (!(this.filters.filter.parametros)){ 
        this.filters.filter = {
            "CicloEvaluacionId": this.cicloEva.cicloEvaluacionId, 
            "AreaResponsableId": this.areasResponsablesArr, 
            "CampusId": this.campusArr,
            "Activo": true,
            "SearchTerm": filtervalue.trim().toLowerCase()
        };
      }else{
        this.filters.filter = {
            "CicloEvaluacionId": this.cicloEva.cicloEvaluacionId, 
            "AreaResponsableId": this.areasResponsablesArr, 
            "CampusId": this.campusArr,
            "Activo": true,
            "SearchTerm": filtervalue.trim().toLowerCase(),
            "parametros": this.filters.filter.parametros
        };
      }
      this.getCeEvaluacionE7Ri(this.filters);
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchsub$.next(filterValue);
  }

  private getCeEvaluacionE7Ri(filter: TablePaginatorSearch) {
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
        this.pageIndex = response.paginacion.pagina;
        this.pageSize = response.paginacion.registros;
        this.length = response.paginacion.count;
        this.cc = '';
      }
    });
  }

  paginatorChange(event: PageEvent): void {
    this.filters.pageSize = event.pageSize;
    this.filters.pageNumber = event.pageIndex;
    this.getCeEvaluacionE7Ri(this.filters);
  }

  showHide() {
    this.toogle = !this.toogle;
  }

  captureRevisor(row: any) {
    row.etapa = row.etapaId;
    row.E6PM = false;
    row.infoEvaluacion = this.cicloEva;
    row.esVista = this.tipoRol == 1 && this.revIns;
    this.dialog.open<ModalRevisorComponent>(ModalRevisorComponent, {
      panelClass: '',
      data: row || null,
      width: '50vw',
      minWidth: '50vw',
      maxHeight: '90vh',
    }).afterClosed().subscribe((result: any) => {
      if (result) {
        this.getCeEvaluacionE7Ri(this.filters);
      }
    });
  }

  aplicarParametros(events: any) { //console.log(events);
    let parametros = new CeIndicadoresEtapasParamsModel();

    if (events.Etapas) {
      parametros.EtapaId = events.Etapas;
    }
    //parametros.AreaResponsableId = (events.NombreArea) ? events.NombreArea : this.areasResponsablesArr;

    if (events.NombreArea) {
      parametros.NombreArea = events.NombreArea;
    }

    if (events.NivelModalidad) {
      parametros.NivelModalidad = events.NivelModalidad;
    }

    let SearchTerm = null;
    if (this.inputSearch.nativeElement) {
      SearchTerm = this.inputSearch.nativeElement.value.trim()
    }

    this.etapas = parametros.EtapaId != undefined;
    this.areaResp = parametros.NombreArea != undefined;
    this.nivelMod = parametros.NivelModalidad != undefined;
    if (SearchTerm == null || SearchTerm == '') {
      this.filters.filter = {
        "cicloEvaluacionId": this.cicloEva.cicloEvaluacionId,
        "CampusId": this.campusArr,
        "AreaResponsableId": this.areasResponsablesArr,
        "Activo": true,
        ...parametros
      };
    } else {
      this.filters.filter = {
        "cicloEvaluacionId": this.cicloEva.cicloEvaluacionId,
        "CampusId": this.campusArr,
        "AreaResponsableId": this.areasResponsablesArr,
        "Activo": true,
        ...parametros,
        "SearchTerm": SearchTerm
      };
    }
    this.getCeEvaluacionE7Ri(this.filters);
  }

  btnCleanFilters(c: any) {
    this.cc = c; //console.log(this.cc);
  }

  obtenerTextoEtapa() {
    return `${this.cicloEva.claveInstitucion} ${this.cicloEva.cicloEvaluacion} ${this.cicloEva.anio}`
  }

  private setPermissions(): void {
    var permisolHeredadoList: PermisosHeredadosDTO[] = JSON.parse(localStorage.getItem('permisosHeredados'));
    var permisolHeredado = permisolHeredadoList.find(p => p.vistaHijo == this.router.url)
    this.permissions = this.access.getPermissionsV2(this.users.userSession.permisosRolesVistas, permisolHeredado.vistaPadre);
  }

  checkPermission(p: string): boolean {
    return this.permissions?.some(r => r.trim() == p.trim())
  }
  
}
