import { Component, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BasicNotification } from 'src/app/utils/helpers/basicNotification';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { CicloEvaluacionIndicadoresDTO, CicloCeEvaluacionAll } from 'src/app/utils/models/ciclo-evaluacion-indicadores.dto';
import { MatTableDataSource } from '@angular/material/table';
import { TablePaginatorSearch, CampusDTOV1, CicloEvaDTOV1, Vista } from 'src/app/utils/models';
import { EvaluationCycleService, DetailsIndicatorsService, ResponsibilityAreasService, CampusService, UsersService } from 'src/app/core/services';
import { saveAs } from 'file-saver';
import tipo from 'src/assets/data/tipoRespuesta.json';
import { MatSelectChange } from '@angular/material/select';
import { MatDrawer } from '@angular/material/sidenav';
import { PermisosHeredadosDTO } from 'src/app/utils/models/permisos-heredados.dto';
import { Alert } from 'src/app/utils/helpers';
import { constants } from 'buffer';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
//import { param } from 'jquery';

@Component({
  selector: 'app-evaluation-generation',
  templateUrl: './evaluation-generation.component.html',
  styleUrls: ['./evaluation-generation.component.scss'],
  providers: [DatePipe]
})
export class EvaluationGenerationComponent implements OnInit {
  @ViewChild('drawer') drawer: MatDrawer | undefined;
  @ViewChild('input', { static: true }) inputSearch: ElementRef;
  @ViewChild('paginator', { static: true }) readonly paginator: MatPaginator;
  dataAll: CicloCeEvaluacionAll[];
  dataSourceAll: MatTableDataSource<CicloCeEvaluacionAll>;
  data: CicloEvaluacionIndicadoresDTO[];
  dataSource: MatTableDataSource<CicloEvaluacionIndicadoresDTO>;
  filters: TablePaginatorSearch;
  pageIndex: number;
  pageSize: number;
  length: number;
  registros: number;
  hasIndictaros: boolean;
  isDisabled = false;
  cicloFilterForm: FormGroup;
  allCampusList: CampusDTOV1[] = [];
  //Seguridad
  thisAccess: Vista;
  permission: boolean;
  permissions: string[];
  //Ciclo
  cicloEva: any;
  nombre: string;
  proceso: string;
  etapas: any[];
  institucion: string;
  //Fechas
  fecIni: any;
  fecFin: any;
  //Listas
  listaCampus: any;
  listaAR: any;
  listaTR: any = tipo;
  listaNivel: any;
  //Campos
  campus: any;
  areaResp: any;
  tipo: any;
  nivelMod: any;
  estatus: any;
  entradaInicial: boolean;
  searchControl = new FormControl();
  //
  metaInput: any;
  //dataBody: { ceevaluacionId: number; metaInstitucional: any; };

  constructor(
    private router: Router,
    private datePipe: DatePipe,
    private basicNotification: BasicNotification,
    private readonly formBuilder: FormBuilder,
    private readonly EvaCService: EvaluationCycleService,
    private detailsIndicator: DetailsIndicatorsService,
    private areaResService: ResponsibilityAreasService,
    private readonly campusService: CampusService,
    private users: UsersService,
    private access: Vista,
  ) {
    this.permission = null;
    this.thisAccess = new Vista();
    this.permissions = [];
    this.dataSource = new MatTableDataSource<CicloEvaluacionIndicadoresDTO>([]);
    this.filters = new TablePaginatorSearch();
    this.hasIndictaros = false;
    this.entradaInicial = true;
    this.cicloFilterForm = this.formBuilder.group({
      campus: [null, []],
      areaResp: [null, []],
      tipo: [null, []],
      nivelMod: [null, []],
      estatus: [null, []],
    });
  }

  ngOnInit(): void {
    this.setPermissions();
    this.pageSize = 25;
    this.length = 0;
    this.pageIndex = this.filters.pageNumber;
    this.filters.pageSize = 25;
    this.filters.filter = {};
    this.cicloEva = JSON.parse(localStorage.getItem('cicloEva')); //console.log(this.cicloEva);
    const { ciclo, cicloEvaluacion, procesoEvaluacion, fechaInicio, fechaFin, etapaEvaluacion, institucion } = this.cicloEva;
    this.nombre = cicloEvaluacion;
    this.proceso = procesoEvaluacion;
    this.fecIni = fechaInicio;
    this.fecFin = fechaFin;
    this.etapas = etapaEvaluacion;
    this.institucion = institucion;
    this.newCiclo();//NUEVO CICLO
    this.editCiclo();//EDITAR CICLO
    this.obtenerIndicadores();
    this.getLists();//LISTAS

    this.searchControl.valueChanges.pipe(
      debounceTime(700), // Espera 700ms después de que el usuario deja de escribir
      distinctUntilChanged() // Emitir solo si el valor es diferente del último emitido
    ).subscribe(value => {
      this.applyFilter(value);
    });

  }

  generarIndicadores() {
    this.getAllCicloEvaIndicadores(this.filters);
  }

  private getAllCicloEvaIndicadores(filter: TablePaginatorSearch) {
    this.dataSource.data = [];
    this.data = [];
    this.EvaCService.getIndicatorsByCycleId(filter, this.cicloEva.cicloEvaluacionId, this.users.userSession.id).subscribe((response) => {
      if (response.output) {
        this.data = response.output.map((indicadorCiclo) => new CicloEvaluacionIndicadoresDTO().deserialize(indicadorCiclo));
        //console.log('data:', this.data);
        this.dataSource.data = this.data;
        this.pageIndex = response.paginacion.pagina;
        this.pageSize = response.paginacion.registros;
        this.length = response.paginacion.count;
        this.basicNotification.notif("success", 'Evaluación generada correctamente');
      } else {
        this.basicNotification.notif("error", 'La evaluación No se genero');
      }
    });

    this.hasIndictaros = (this.data != null) ? true : false;
  }

  obtenerIndicadores() {
    this.getCeEvaluacionParams(this.filters);
  }

  private getCeEvaluacionAll(filter: TablePaginatorSearch) {
    this.dataSource.data = [];
    this.data = [];
    this.EvaCService.getCeEvaluacionAll(filter, this.cicloEva.cicloEvaluacionId).subscribe((response) => {
      if (response.output) {
        //this.dataAll = response.output.map((indicadorCiclo) => new CicloCeEvaluacionAll().deserialize(indicadorCiclo));
        this.data = response.output.map((indicadorCiclo) => new CicloEvaluacionIndicadoresDTO().deserialize(indicadorCiclo));
        this.dataSource.data = this.data; //console.log(this.data);
        this.pageIndex = response.paginacion.pagina;
        this.pageSize = response.paginacion.registros;
        this.length = response.paginacion.count;
        if (this.entradaInicial)
          this.registros = response.paginacion.count;

        this.entradaInicial = false;
        //se compara con this.hasIndictaros para que no desaparezca la tabla cuando se filtra en la busqueda y no se trae resultados
        this.hasIndictaros = this.length > 0 || this.hasIndictaros;
      } else {
        this.basicNotification.notif("error", 'La evaluación No se genero');
      }
    });
  }

  private getCeEvaluacionParams(filter: TablePaginatorSearch) {
    this.dataSource.data = [];
    this.data = [];
    this.EvaCService.getCeEvaluacionWithParams(filter, this.cicloEva.cicloEvaluacionId).subscribe((response) => {
      if (response.output) {
        this.data = response.output.map((indicadorCiclo) => new CicloEvaluacionIndicadoresDTO().deserialize(indicadorCiclo));
        this.dataSource.data = this.data;
        this.pageIndex = response.paginacion.pagina;
        this.pageSize = response.paginacion.registros;
        this.length = response.paginacion.count;
        if (this.entradaInicial)
          this.registros = response.paginacion.count;

        this.entradaInicial = false;
        //se compara con this.hasIndictaros para que no desaparezca la tabla cuando se filtra en la busqueda y no se trae resultados
        this.hasIndictaros = this.length > 0 || this.hasIndictaros;
      } else {
        this.basicNotification.notif("error", 'La busqueda No se genero');
      }
    });
  }

  private getCeEvaluacionList() {
    let filters = new TablePaginatorSearch();
    filters.filter = {};
    filters.pageSize = 0;
    filters.pageNumber = 0;
    this.EvaCService.getCeEvaluacionWithParams(filters, this.cicloEva.cicloEvaluacionId).subscribe((response) => {
      console.log('getCeEvaluacionAll:', response.output);
      if (response.output) {
        this.dataAll = response.output.map((indicadorCiclo) => new CicloCeEvaluacionAll().deserialize(indicadorCiclo));
        this.getCampus(this.dataAll);
        this.getAreas(this.dataAll);
        this.getNivel(this.dataAll);
      } else {
        console.warn("error", 'La busqueda de Listas No se genero');
      }
    });
  }

  getLists() {
    this.getAllCampus();
    this.getAllAreaResp();
    this.getAllNivel();
    //this.getCeEvaluacionList();
  }

  paginatorChange(event: PageEvent): void {
    this.filters.pageSize = event.pageSize;
    this.filters.pageNumber = event.pageIndex;
    this.getCeEvaluacionParams(this.filters);
  }

  getAllExcel(): void {
    this.filters.pageSize = 0;
    this.filters.pageNumber = 0;
    this.EvaCService
      .getAllExcel(this.filters, this.cicloEva.cicloEvaluacionId)
      .subscribe((response) => saveAs(response, 'CicloEvaluacionProceso.xlsx'));
  }

  // applyFilter(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   if (filterValue.length > 2 || filterValue.length == 0) {
  //     this.filters.filter = {
  //       NombreCampus: filterValue.trim().toLowerCase(),
  //       NombreArea: filterValue.trim().toLowerCase(),
  //       ClaveIndicador: filterValue.trim().toLowerCase(),
  //       NombreIndicador: filterValue.trim().toLowerCase(),
  //       DescripcionIndicador: filterValue.trim().toLowerCase(),
  //     };
  //     this.filters.pageNumber = 0;
  //     this.pageIndex = this.filters.pageNumber;
  //     this.getCeEvaluacionAll(this.filters);
  //     this.dataSource.filter = filterValue.trim().toLowerCase();
  //   }
  // }

  // applyFilter(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   if (filterValue.length > 2 || filterValue.length == 0) {
  //     this.filters.filter = {
  //       ...this.filters.filter ,
  //       SearchTerm: filterValue.trim().toLowerCase()
  //     };
  //     this.filters.pageNumber = 0;
  //     this.pageIndex = this.filters.pageNumber;
  //     this.getCeEvaluacionParams(this.filters);
  //     this.dataSource.filter = filterValue.trim().toLowerCase();
  //   }
  // }

  applyFilter(filterValue: string) {
    if (filterValue.length > 2 || filterValue.length == 0) {
      this.filters.filter = {
        ...this.filters.filter,
        SearchTerm: filterValue.trim().toLowerCase()
      };
      this.filters.pageNumber = 0;
      this.pageIndex = this.filters.pageNumber;
      this.getCeEvaluacionParams(this.filters);
    }
  }


  aplicarFiltro() {
    console.log('Click Filtro');
    this.campus = this.paramsAll(this.cicloFilterForm.get('campus').value);
    this.areaResp = this.paramsAll(this.cicloFilterForm.get('areaResp').value); 
    this.tipo = this.paramsAll(this.cicloFilterForm.get('tipo').value);
    this.nivelMod = this.paramsAll(this.cicloFilterForm.get('nivelMod').value);
    this.estatus = this.paramsAll(this.cicloFilterForm.get('estatus').value);

    const NombreCampus = (this.campus) ? (this.campus.length >= 1 && this.campus.length <= this.listaCampus.length) ? this.campus : null : null;
    const NombreArea = (this.areaResp) ? (this.areaResp.length >= 1 && this.areaResp.length <= this.listaAR.length) ? this.areaResp : null : null;
    const IndicadorTipoResultado = (this.tipo) ? (this.tipo.length > 1) ? null : this.tipo[0] : null;
    //const IndicadorTipoResultado = (this.tipo)?(this.tipo.length>=1 && this.tipo.length<=this.listaTR.length)?this.tipo[0]:null:null;
    const NivelModalidad = (this.nivelMod) ? (this.nivelMod.length >= 1 && this.nivelMod.length <= this.listaNivel.length) ? this.nivelMod : null : null;
    const Activo = (this.estatus) ? (this.estatus.length > 1) ? null : this.estatus[0] : null;
    //const Activo = (this.estatus)?(this.estatus.length>=1 && this.estatus.length<=2)?this.estatus[0]:null:null; //console.log(activo);

    const params = {
      NombreCampus,
      NombreArea,
      IndicadorTipoResultado,
      NivelModalidad,
      Activo, 
      SearchTerm: this.filters.filter.SearchTerm
    }
    console.log(params);
    this.applyFilterParams(params);
  }

  applyFilterParams(params: any): void {
    this.filters.filter = params;
    this.filters.pageNumber = 0;
    this.pageIndex = this.filters.pageNumber;
    this.getCeEvaluacionParams(this.filters);
    if (this.drawer) {
      this.drawer.toggle();
    }
  }

  paramsAll(data: any) {
    const val = data;//console.log('data:',val);
    if (val && val[0] === 0) { val.splice(0, 1) }//console.log(val);
    return val;
  }

  getCampus(arr: any) {
    const unique: any[] = [];
    const items: any[] = [];
    arr.forEach(function (row: { nombreCampus: any; }) {//console.log(row.nombreCampus);
      if (!unique.includes(row.nombreCampus)) {
        unique.push(row.nombreCampus);
      }
    });
    for (let item of unique) {
      items.push({ nombre: item });
    }
    this.listaCampus = items; //console.log('ListaCampus:',this.listaCampus);
  }

  getAreas(arr: any) {
    const unique: any[] = [];
    const items: any[] = [];
    arr.forEach(function (row: { nombreArea: any; }) {//console.log(row.nombreArea);
      if (!unique.includes(row.nombreArea)) {
        unique.push(row.nombreArea);
      }
    });
    for (let item of unique) {
      items.push({ nombre: item });
    }
    this.listaAR = items; //console.log('ListaArea:',this.listaAR);
  }

  getNivel(arr: any) {
    const unique: any[] = [];
    const items: any[] = [];
    arr.forEach(function (row: { nivelModalidad: any; }) {//console.log(row.nivelModalidad);
      if (!unique.includes(row.nivelModalidad)) {
        unique.push(row.nivelModalidad);
      }
    });
    for (let item of unique) {
      items.push({ clave: item });
    }
    this.listaNivel = items; //console.log('ListaNivel:',this.listaNivel);
  }

  disableCeEvaluacion(data: any): void {
    const msg = `Indicador ${data.activo ? 'inactivado' : 'activado'} correctamente`;
    this.EvaCService.disableCEEvaluacion(data.ceevaluacionId, !data.activo).subscribe((response) => {
      if (response.exito) {
        this.basicNotification.notif("success", msg);
        this.getCeEvaluacionParams(this.filters);
      } else {
        console.error(response.mensaje);
        this.basicNotification.notif("error", `No se puede ${!data.activo ? 'inactivar' : 'activar'} el Indicador`);
      }
    });
  }

  disableCeEvaluacionByConfimation(data: any): void {
    if (!data.activo) return;
    Alert.confirm('Inactivar indicador', `Una vez inactivado el indicador ya no se mostrará en ninguna etapa del ciclo de evaluación y no podrá activarse nuevamente ¿Deseas continuar?`).subscribe((result) => {
      if (!result || !result.isConfirmed) {
        this.obtenerIndicadores();
        return;
      }
      this.disableCeEvaluacion(data);
    });
  }

  newCiclo() {
    const newCiclo = JSON.parse(localStorage.getItem('newCiclo')); //console.log('newCiclo', newCiclo);
    if (newCiclo) {
      setTimeout(() => {
        this.basicNotification.notif("success", 'Ciclo de evaluación guardado correctamente', 6000);
        localStorage.removeItem("newCiclo");
      }, 800);
    }
  }

  editCiclo() {
    const editCicloStatus = localStorage.getItem('editCicloStatus'); //console.log('editCicloStatus', editCicloStatus);
    if (editCicloStatus) {
      setTimeout(() => {
        const msg = (editCicloStatus == 'success') ? 'Ciclo de Evaluación actualizado correctamente' : 'Ciclo de Evaluación No se actualizo correctamente';
        this.basicNotification.notif(editCicloStatus, msg, 6000);
        localStorage.removeItem("editCicloStatus");
      }, 1000);
    }
  }

  getAllCampus(): void {
    const filter = new TablePaginatorSearch();
    filter.filter = { activo: true };
    filter.pageSize = 9999;
    //filter.inactives = true;
    this.campusService.getAllCampus(filter).subscribe((response) => {
      if (response.data) {
        const data = response.data.map((campus) => new CampusDTOV1().deserialize(campus));
        this.listaCampus = data.filter((x: any) => x.activo == true && x.institucion == this.institucion); //console.log(this.listaCampus);
      }
    });
  }

  getAllAreaResp(): void {
    let filter = new TablePaginatorSearch();
    filter.filter = { activo: true };
    filter.pageSize = 9999;
    //filter.pageNumber = 0;
    this.areaResService.getAllResponsibilityAreasCampus(filter).subscribe((response) => {
      if (response.data) {
        const data = response.data;
        this.listaAR = data.filter((x: any) => x.activo == true && x.institucion == this.institucion); //console.log('ListadoArea',this.listaAR);
      }
    });
    //this.detailsIndicator.getAR().subscribe((response) => {
    //  if(response.output){ this.listaAR = response.output; console.log(this.listaAR); }
    //});
  }

  getAllNivel(): void {
    let filter = new TablePaginatorSearch();
    filter.filter = { activo: true };
    filter.pageSize = 9999;
    //filter.pageNumber = 0;
    this.detailsIndicator.getTipoNivel(filter).subscribe((response) => {
      if (response.output) {
        const data = response.output;
        this.listaNivel = data.filter((x: any) => x.activo == true); //console.log('ListadoNivel',this.listaNivel);
      }
    });
  }

  btnCleanFilters(c: any) {
    if (c == 'all') {
      this.cicloFilterForm.get('campus').setValue(null);
      this.cicloFilterForm.get('areaResp').setValue(null);
      this.cicloFilterForm.get('tipo').setValue(null);
      this.cicloFilterForm.get('nivelMod').setValue(null);
      this.cicloFilterForm.get('estatus').setValue(null);
    } else {
      this.filters.pageSize = 25;
      this.filters.pageNumber = 0;
      this.cicloFilterForm.get(c).setValue(null);
      this.aplicarFiltro();
      if (this.drawer) {
        this.drawer.toggle();
      }
    }
  }

  onSelectionChange(event: MatSelectChange, campo: any) {
    let val = event.value;//console.log('Event.value',val);
    if (campo === 'campus') {
      if (val.length <= this.listaCampus.length) {
        if (val[0] === 0) {
          val.splice(0, 1);
          this.cicloFilterForm.controls.campus.patchValue(val);
        }
      }
    }
    if (campo === 'areaResp') {
      if (val.length <= this.listaAR.length) {
        if (val[0] === 0) {
          val.splice(0, 1);
          this.cicloFilterForm.controls.areaResp.patchValue(val);
        }
      }
    }
    if (campo === 'tipo') {
      if (val.length <= this.listaTR.length) {
        if (val[0] === 0) {
          val.splice(0, 1);
          this.cicloFilterForm.controls.tipo.patchValue(val);
        }
      }
    }
    if (campo === 'nivelMod') {
      if (val.length <= this.listaNivel.length) {
        if (val[0] === 0) {
          val.splice(0, 1);
          this.cicloFilterForm.controls.nivelMod.patchValue(val);
        }
      }
    }
    if (campo === 'estatus') {
      if (val.length <= 2) {
        if (val[0] === 0) {
          val.splice(0, 1);
          this.cicloFilterForm.controls.estatus.patchValue(val);
        }
      }
    }
    //console.log(val);
  }

  toggleAllSelection(campo: any) {
    if (campo === 'campus') {
      const allSelected = this.cicloFilterForm.controls.campus.value.length === this.listaCampus.length; //console.log(this.cicloFilterForm.controls.campuses.value.length,this.listaCampus.length,allSelected);
      this.cicloFilterForm.controls.campus.patchValue(allSelected ? [] : [0, ...this.listaCampus.map((item: { nombre: any; }) => item.nombre)]); //console.log([0,...this.campusList.map(item => item.id)]);
    }
    if (campo === 'areaResp') {
      const allSelected = this.cicloFilterForm.controls.areaResp.value.length === this.listaAR.length; //console.log(this.cicloFilterForm.controls.campuses.value.length,this.campusList.length,allSelected);
      this.cicloFilterForm.controls.areaResp.patchValue(allSelected ? [] : [0, ...this.listaAR.map((item: { nombre: any; }) => item.nombre)]); //console.log([0,...this.campusList.map(item => item.id)]);
    }
    if (campo === 'tipo') {
      const allSelected = this.cicloFilterForm.controls.tipo.value.length === this.listaTR.length; //console.log(this.cicloFilterForm.controls.tipo.value.length,this.listaTR.length,allSelected);
      this.cicloFilterForm.controls.tipo.patchValue(allSelected ? [] : [0, ...this.listaTR.map((item: { id: any; }) => item.id)]); //console.log([0,...this.campusList.map(item => item.id)]);
    }
    if (campo === 'nivelMod') {
      const allSelected = this.cicloFilterForm.controls.nivelMod.value.length === this.listaNivel.length; //console.log(this.cicloFilterForm.controls.campuses.value.length,this.campusList.length,allSelected);
      this.cicloFilterForm.controls.nivelMod.patchValue(allSelected ? [] : [0, ...this.listaNivel.map((item: { clave: any; }) => item.clave)]); //console.log([0,...this.campusList.map(item => item.id)]);
    }
    if (campo === 'estatus') {
      const allSelected = this.cicloFilterForm.controls.estatus.value.length === 2; //console.log(this.cicloFilterForm.controls.estatus.value.length,2,allSelected);
      this.cicloFilterForm.controls.estatus.patchValue(allSelected ? [] : [0, true, false]); //console.log([0,...this.campusList.map(item => item.id)]);  
    }
  }

  private setPermissions(): void {
    var permisolHeredadoList: PermisosHeredadosDTO[] = JSON.parse(localStorage.getItem('permisosHeredados'));

    var permisolHeredado = permisolHeredadoList.find(p => p.vistaHijo == this.router.url)

    this.permissions = this.access.getPermissionsV2(this.users.userSession.permisosRolesVistas, permisolHeredado?.vistaPadre);



  }

  checkPermission(p: string): boolean {
    return this.permissions?.some(r => r.trim() == p.trim())
  }

  redirectViewIndicatorCE(indicador: any): void {
    var urlRedirect = "/detalles-indicadores-ce";
    localStorage.setItem('idIndicadorSiac', JSON.stringify(indicador));
    this.setPermisosHeredados(urlRedirect);
    window.location.assign(urlRedirect);

    
  }

  setPermisosHeredados(urlRedirect : string){
    var permisolHeredadoList: PermisosHeredadosDTO[] = JSON.parse(localStorage.getItem('permisosHeredados'));
    var permisolHeredado = permisolHeredadoList.find(p => p.vistaHijo == this.router.url)

    var permiso = new PermisosHeredadosDTO();
      permiso.vistaPadre = permisolHeredado?.vistaPadre;
      permiso.vistaHijo = urlRedirect;
      
      var permisosHeredados: PermisosHeredadosDTO[] = JSON.parse(localStorage.getItem('permisosHeredados'));
      if(permisosHeredados == null ){
        permisosHeredados = [];
        permisosHeredados.push(permiso);
      }else{
        var permisoFind = permisosHeredados.find(p => p.vistaHijo == urlRedirect)
        if (permisoFind == null){
          permisosHeredados.push(permiso);
        }
      }
      localStorage.setItem('permisosHeredados', JSON.stringify(permisosHeredados));
  }



  limitarCaracteres(event: any) {
    const {value} = event.target;
    if (value) {
      event.target.value = value.replace('.', '');
    }
    if (value.length > 6) {
      event.target.value = value.slice(0, 6);
      if(value.length==5){event.target.value = value; return}
    }
  }

  metaEdit(row: any): void {
    row.editingMeta = true;
    this.focusMetaInput();
  }

  metaEditClose(row: any): void {
    row.editingMeta = false;
  }

  focusMetaInput() {
    setTimeout(() => {
      this.metaInput?.nativeElement.focus();
    });
  }

  metaUpdate(Id: any, n: any) {
    const metaInstitucional = (document.querySelector('.metaInput-' + n) as HTMLFormElement).value; //console.log(metaInstitucional);
    this.EvaCService.updateMetaInstitucional(Id, metaInstitucional).subscribe((response) => {
      if (response.exito) {
        console.log(response);
        this.basicNotification.notif("success", "Meta institucional actualizada correctamente", 3000);
        this.getCeEvaluacionParams(this.filters);
      }
    });
  }

}

