import { Component, EventEmitter, Input, OnInit, Output, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { MatDrawer } from '@angular/material/sidenav';
import { EvaluationCycleService, EvaluationCriteriosService, UsersService } from 'src/app/core/services';
import { TablePaginatorSearch } from 'src/app/utils/models';
import { CicloCeEvaluacionAll } from 'src/app/utils/models/ciclo-evaluacion-indicadores.dto';
import tipo from 'src/assets/data/tipoRespuesta.json';

export class Parametros {
  CampusIds: number[];
  NivelModalidadIds: number[];
}

@Component({
  selector: 'app-indicator-goal-parameters-control',
  templateUrl: './indicator-goal-parameters-control.component.html',
  styleUrls: ['./indicator-goal-parameters-control.component.scss']
})
export class IndicatorGoalParametersControlComponent implements OnInit {
  @Input() cc: any;
  @Input() tipoVista: number = 1; // Con esta variable se manipula lo que se puede ver o no
  @Input() nivelEtapa: number = 1; // puede usarte 1 como consulta en andelante 
  @Output() aplicarParametros = new EventEmitter<any>();
  @ViewChild('drawer') drawer: MatDrawer | undefined;
  @Input() etapa: any;

  filters: TablePaginatorSearch;
  pageIndex: number;
  pageSize: number;
  length: number;

  parametros: Parametros;
  cicloFilterForm: FormGroup;
  //Listas
  listaSubarea: any;
  listaCampus: any;
  listaAR: any;
  listaTR: any = tipo;
  listaNivel: any;
  listaEstatus: any;
  listaEstatusRi: any;
  //Campos
  campus: any;
  areaResp: any;
  tipo: any;
  nivelMod: any;
  avance: any;
  estatusCaptura: any;
  subAreaCentral: any;
  sesionRetro: any;
  estatusRi: any;

  verCampus = true;
  verAreaResposable = true;
  verTipoResultado = true;
  verNivelModalidad = true;
  verSubAreaCentral = true;
  verAvance = true;
  verSesionRetro = false;
  verEstatusCaptura = true;
  verEstatusRi = false;

  cicloEvaluacionId = 0;
  cicloEva :any;
  tipoUser: any;
  revIns: any;

  obtenerDatosDeStorage(): any {
    let datoStorage = JSON.parse(localStorage.getItem('cycleStage'));
    if (datoStorage[0]) {
      if (datoStorage[0].etapaEvaluacion) {
        if (datoStorage[0].etapaEvaluacion.length > 0) {
          datoStorage[0].fechaInicio = datoStorage[0].etapaEvaluacion[0].fechaInicio;
          datoStorage[0].fechaFin = datoStorage[0].etapaEvaluacion[0].fechaFin;
        }
      }
      //  let datoCiclo = datoStorage[0].ciclo +"-" + datoStorage[0].cicloEvaluacion
      //  datoStorage[0].ciclo= datoCiclo;
    }

    return datoStorage[0];
  }

  constructor(private readonly formBuilder: FormBuilder,
    private readonly EvaCService: EvaluationCycleService,
    private readonly ECService: EvaluationCriteriosService,
    private users: UsersService
  ) {
    this.tipoUser = users.userSession.tipoRol;
    this.cicloEva =  this.obtenerDatosDeStorage();
    this.cicloEvaluacionId =this.cicloEva.cicloEvaluacionId;
    this.cicloFilterForm = this.formBuilder.group({
      campus: [null, []],
      areaResp: [null, []],
      tipo: [null, []],
      nivelMod: [null, []],
      avance: [null, []],
      estatusCaptura: [null, []],
      subAreaCentral: [null, []],
      sesionRetro: [null, []],
      estatusRi: [null, []]
    });

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.cc) {//console.log('El valor del componente padre ha cambiado '+ this.cc);
      if (this.cc)
      {
        this.cicloFilterForm.get(this.cc).setValue(null);
        this.aplicarFiltro();
        if (this.drawer) { this.drawer.toggle(); }  
      }
    }
  }


  configureView() {
    switch (this.tipoVista) {
      case 1:
        this.verSubAreaCentral = false;
        this.verEstatusCaptura = false;
        break;
      case 2:
        this.verAvance = false;
        this.verTipoResultado = false;
        break;
      default:
        this.verCampus = true;
        this.verAreaResposable = true;
        this.verTipoResultado = true;
        this.verNivelModalidad = true;
        this.verSubAreaCentral = true;
        this.verAvance = true;
        break;
    }


    if (!this.tipoVista) {
      this.verSubAreaCentral = false;
      this.verEstatusCaptura = false;
    }
  }

  ngOnInit(): void {
    this.filters = new TablePaginatorSearch();
    this.filters.pageSize = 25;
    this.filters.pageNumber = 0;
    this.filters.filter = {
      "cicloEvaluacionId": this.cicloEva.cicloEvaluacionId,
      "UsuarioId": this.users.userSession.id,
      "Activo": true,
      "textoBusqueda": null,
      "Parametros": this.parametros
    };
    this.getCeEvaluacionList();
    this.revIns = JSON.parse(localStorage.getItem('revIns'));
    if(this.revIns){//if(this.tipoUser == 2){
      this.verEstatusRi = true;
      this.getStatusRi();
    }
  }

  paramsAll(data: any) {
    const val = data;//console.log('data:',val);
    if (val && val[0] === 0) { val.splice(0, 1) }//console.log(val);
    return val;
  }

  aplicarFiltro() {
    this.campus = this.paramsAll(this.cicloFilterForm.get('campus').value);
    this.areaResp = this.paramsAll(this.cicloFilterForm.get('areaResp').value);
    this.tipo = this.paramsAll(this.cicloFilterForm.get('tipo').value);
    this.nivelMod = this.paramsAll(this.cicloFilterForm.get('nivelMod').value);
    this.estatusCaptura = this.paramsAll(this.cicloFilterForm.get('estatusCaptura').value);
    this.subAreaCentral = this.paramsAll(this.cicloFilterForm.get('subAreaCentral').value);
    this.avance = this.paramsAll(this.cicloFilterForm.get('avance').value);
    this.sesionRetro = this.paramsAll(this.cicloFilterForm.get('sesionRetro').value);
    this.estatusRi = this.paramsAll(this.cicloFilterForm.get('estatusRi').value);

    const NombreCampus = (this.campus) ? (this.campus.length >= 1 && this.campus.length <= this.listaCampus.length) ? this.campus : null : null;
    const NombreArea = (this.areaResp) ? (this.areaResp.length >= 1 && this.areaResp.length <= this.listaAR.length) ? this.areaResp : null : null;
    const IndicadorTipoResultado = (this.tipo);
    const NivelModalidad = this.nivelMod ? [this.nivelMod] : null; //? (this.nivelMod.length >= 1 && this.nivelMod.length <= this.listaNivel.length) ? this.nivelMod : null : null;
    const Avance = (this.avance);
    const EstatusCaptura = this.estatusCaptura?.length > 0 ? this.estatusCaptura : null;
    const SubAreaCentral = this.subAreaCentral?.length > 0 ? this.subAreaCentral : null;
    const SesionRetro = this.sesionRetro;
    const EstatusRi = this.estatusRi?.length > 0 ? this.estatusRi : null;

    const params = {
      NombreCampus,
      NombreArea,
      IndicadorTipoResultado,
      NivelModalidad,
      Avance,
      EstatusCaptura,
      SubAreaCentral,
      SesionRetro,
      EstatusRi
    }; //console.log(params);

    if (this.drawer) {
      this.drawer.toggle();
    }
    this.aplicarParametros.emit(params);

  }

  toggleAllSelection(campo: any) {
    if (campo === 'campus') {
      let ids = this.listaCampus.map((ids: any) => ids.campusId);
      ids = [0].concat(ids);
      if (this.cicloFilterForm.controls.campus.value.length === (ids.length - 1)) {
        ids = [];
      }
      this.cicloFilterForm.controls.campus.setValue(ids);
    }
    if (campo === 'areaResp') {
      let ids = this.listaAR.map((ids: any) => ids.areaId);
      ids = [0].concat(ids);
      if (this.cicloFilterForm.controls.areaResp.value.length === (ids.length - 1)) {
        ids = [];
      }
      this.cicloFilterForm.controls.areaResp.setValue(ids);
    }
    if (campo === 'tipo') {
      let ids = this.listaTR.map((ids: any) => ids.id);
      ids = [0].concat(ids);
      if (this.cicloFilterForm.controls.tipo.value.length === (ids.length - 1)) {
        ids = [];
      }
      this.cicloFilterForm.controls.tipo.setValue(ids);
    }
    if (campo === 'nivelMod') {
      let ids = this.listaNivel.map((ids: any) => ids.nivelModalidadId);
      ids = [0].concat(ids);
      if (this.cicloFilterForm.controls.nivelMod.value.length === (ids.length - 1)) {
        ids = [];
      }
      this.cicloFilterForm.controls.nivelMod.setValue(ids);
    }
    if (campo === 'estatus') {
      const allSelected = this.cicloFilterForm.controls.estatus.value.length === 2; //console.log(this.cicloFilterForm.controls.estatus.value.length,2,allSelected);
      this.cicloFilterForm.controls.estatus.patchValue(allSelected ? [] : [0, true, false]); //console.log([0,...this.campusList.map(item => item.id)]);  
    }
    if (campo === 'subAreaCentral') {
      let ids = this.listaSubarea.map((ids: any) => ids.id);
      ids = [0].concat(ids);
      if (this.cicloFilterForm.controls.subAreaCentral.value.length === (ids.length - 1)) {
        ids = [];
      }
      this.cicloFilterForm.controls.subAreaCentral.setValue(ids);
    }
    if (campo === 'estatuscaptura') {
      let ids = this.listaEstatus.map((ids: any) => ids.estatusId);
      ids = [0].concat(ids);
      if (this.cicloFilterForm.controls.estatusCaptura.value.length === (ids.length - 1)) {
        ids = [];
      }
      this.cicloFilterForm.controls.estatusCaptura.setValue(ids);
    }
    if (campo === 'estatusRi') {
      let ids = this.listaEstatusRi.map((ids: any) => ids.id);
      ids = [0].concat(ids);
      if (this.cicloFilterForm.controls.estatusRi.value.length === (ids.length - 1)) {
        ids = [];
      }
      this.cicloFilterForm.controls.estatusRi.setValue(ids);
    }

  }

  applyFilterParams(params: any): void {
    this.filters.filter = params;
    this.filters.pageNumber = 0;
    this.pageIndex = this.filters.pageNumber;
  }

  CleanFilters(c: any) {

    if (c == 'all') {
      this.cicloFilterForm.get('campus').setValue(null);
      this.cicloFilterForm.get('areaResp').setValue(null);
      this.cicloFilterForm.get('tipo').setValue(null);
      this.cicloFilterForm.get('nivelMod').setValue(null);
      this.cicloFilterForm.get('avance').setValue(null);
      this.cicloFilterForm.get('sesionRetro').setValue(null);
      this.cicloFilterForm.get('estatusRi').setValue(null);
      if (this.verSubAreaCentral){
        this.cicloFilterForm.get('subAreaCentral').setValue(null);        
        this.cicloFilterForm.get('estatusCaptura').setValue(null);
      }
    } else {
      this.cicloFilterForm.get(c).setValue(null);
      // this.aplicarFiltro();
      // if (this.drawer) {
      //   this.drawer.toggle();
      // }
    }

    const NombreCampus: any = null;
    const NombreArea: any = null;
    const IndicadorTipoResultado: any = null;
    const NivelModalidad: any = null;
    const Avance: any = null;
    const EstatusCaptura: any = null;
    const SubAreaCentral: any = null;
    const SesionRetro: any = null;
    const EstatusRi: any = null;

    const paramsC = {
      NombreCampus,
      NombreArea,
      IndicadorTipoResultado,
      NivelModalidad,
      Avance,
      EstatusCaptura,
      SubAreaCentral,
      SesionRetro, 
      EstatusRi
    }

    if (this.drawer) {
      this.drawer.toggle();
    }
    this.aplicarParametros.emit(paramsC);
  }

  onSelectionChange(event: MatSelectChange, campo: any) {

    let val = event.value;
    if (campo === 'campus') {
      this.cicloFilterForm.controls.campus.setValue(event.value);
    }

    if (campo === 'areaResp') {
      this.cicloFilterForm.controls.areaResp.setValue(event.value);
    }

    if (campo === 'tipo') {
      this.cicloFilterForm.controls.tipo.setValue(event.value);
    }

    if (campo === 'nivelMod') {
      this.cicloFilterForm.controls.nivelMod.setValue(event.value);
    }

    if (campo === 'avance') {
      this.cicloFilterForm.controls.avance.setValue(event.value);
    }

    if (campo === 'subAreaCentral') {
      this.cicloFilterForm.controls.subAreaCentral.setValue(event.value);
    }
  }


  toggle() {
    this.configureView()
    this.drawer.toggle();
  }

  dataAll: CicloCeEvaluacionAll[];

  private getCeEvaluacionList() {
    let filters = new TablePaginatorSearch();
    filters.filter = {};
    filters.pageSize = 0;
    filters.pageNumber = 0;

    this.EvaCService.getGetCeDataGoalParameters(filters, this.cicloEvaluacionId).subscribe((response) => {

      if (response.output) {
        this.dataAll = response.output.parametersdata.map((indicadorCiclo: any) => new CicloCeEvaluacionAll().deserialize(indicadorCiclo));
        this.getCampus(this.dataAll);
        this.getAreas(this.dataAll);
        this.getNivel(this.dataAll);
        this.getEstatus(this.dataAll);
        this.getSubAreaCentral(response.output.subAreaCentral);
      } else {
        console.warn("error", 'La busqueda de Listas No se genero');
      }
    });
  }


  groupByArray(xs: any, key: any) {
    return xs.reduce(function (rv: any, x: any) {
      let v = key instanceof Function ? key(x) : x[key];
      let el = rv.find((r: any) => r && r.key === v);
      if (el) {
        el.values.push(x);
      }
      else {
        rv.push({
          key: v,
          values: [x]
        });
      }
      return rv;
    }, []);
  }

  getSubAreaCentral(arr: any) {
    let arrdata = arr.map((x: any) => { return { nombre: x.nombre, id: x.id } });
    let arrdata1 = this.groupByArray(arrdata, 'id').map((x: any) => { return { nombre: x.values[0].nombre, id: x.key } });;
    this.listaSubarea = arrdata1;
  }

  getCampus(arr: any) {
    let arrdata = arr.map((x: any) => { return { nombreCampus: x.nombreCampus, campusId: x.campusId } });
    let arrdata1 = this.groupByArray(arrdata, 'campusId').map((x: any) => { return { nombreCampus: x.values[0].nombreCampus, campusId: x.key } });;
    this.listaCampus = arrdata1;
  }

  getAreas(arr: any) {
    let arrdata = arr.map((x: any) => { return { nombreArea: x.nombreArea, areaId: x.areaId } });
    let arrdata1 = this.groupByArray(arrdata, 'areaId').map((x: any) => { return { nombreArea: x.values[0].nombreArea, areaId: x.key } });;
    this.listaAR = arrdata1;
  }

  getNivel(arr: any) {
    let arrdata = arr.map((x: any) => { return { nivelModalidad: x.nivelModalidad, nivelModalidadId: x.nivelModalidadId } });
    let arrdata1 = this.groupByArray(arrdata, 'nivelModalidadId').map((x: any) => { return { nivelModalidad: x.values[0].nivelModalidad, nivelModalidadId: x.key } });;
    arrdata1 = arrdata1.filter((idnull: any) => idnull.nivelModalidadId != null);// remuevo nulos
    this.listaNivel = arrdata1;
  }

  getEstatus(arr: any) {
    let etapaId = 0;
    if (this.cicloEva){
      if (this.cicloEva.etapaEvaluacion){
        if (this.cicloEva.etapaEvaluacion.length > 0){
          etapaId = this.cicloEva.etapaEvaluacion[0].etapaId;
        }  
      }
    }

    etapaId = (this.etapa) ? this.etapa : etapaId; //console.log(etapaId);
    switch (etapaId) { 
      case 2: // evidencias
      this.listaEstatus = [{ estatusId: 1, Descripcion: 'Pendiente' }, { estatusId: 2, Descripcion: 'Cargada' }, { estatusId: 3, Descripcion: 'No aceptada' },
        { estatusId: 4, Descripcion: 'Aceptada' }, { estatusId: 5, Descripcion: 'N/A en revision' },{ estatusId: 6, Descripcion: 'N/A no autorizado' },{ estatusId: 7, Descripcion: 'N/A autorizado' }];
        break;
      case 5: // Revision autoevaluacion
        if (this.nivelEtapa == 1) // Consulta 
        {
          this.verCampus = true;
          this.verAreaResposable= true;
        }
        else // 2 revision
        {  
        this.verCampus = false;
        this.verAreaResposable= false;
        }
        this.listaEstatus = [{ estatusId: 1, Descripcion: 'Pendiente' }, { estatusId: 2, Descripcion: 'Revisada' }, { estatusId: 3, Descripcion: 'N/A en revisión' },
          { estatusId: 4, Descripcion: 'N/A autorizado' }, { estatusId: 5, Descripcion: 'N/A no autorizado' }];
        break;
      case 6:
        this.verCampus = this.tipoUser == 2;
        this.verAreaResposable= this.tipoUser == 2;
        this.listaEstatus = [{ estatusId: 21, Descripcion: 'Pendiente' }, { estatusId: 22, Descripcion: 'Decisión tomada' }, { estatusId: 23, Descripcion: 'N/R en revisión' }, 
          { estatusId: 24, Descripcion: 'N/R autorizado' }, { estatusId: 25, Descripcion: 'N/R no autorizado' }, { estatusId: 26, Descripcion: 'No requerida' }];
        break;
      case 7:
        this.verCampus = this.tipoUser == 2;
        this.verAreaResposable= this.tipoUser == 2;
        this.listaEstatus = [{ estatusId: 1, Descripcion: 'Pendiente' }, { estatusId: 2, Descripcion: 'Guardada' }];
        break;
      case 9:
        this.verCampus = true;
        this.verAreaResposable = true;
        this.verNivelModalidad = false;
        this.verSubAreaCentral = false;
        this.verSesionRetro = true;
        this.listaEstatus = [{ estatusId: 12, Descripcion: 'Pendiente de autorización' }, { estatusId: 13, Descripcion: 'Autorizado' }, { estatusId: 14, Descripcion: 'No autorizado' }];
        break;
      default:
        console.warn('No localizo id etapa en control parametros');
        this.listaEstatus = [{ estatusId: 1, Descripcion: 'Pendiente' }, { estatusId: 2, Descripcion: 'Capturada' }, { estatusId: 3, Descripcion: 'N/A en revisión' },
          { estatusId: 4, Descripcion: 'N/A no autorizado' }, { estatusId: 5, Descripcion: 'N/A autorizado' }];
        break;
    }
  }

  getStatusRi() {
    this.ECService.getStatusRI().subscribe((response) => {
      if (response.exito) {
        this.listaEstatusRi = response.output; //console.log('listaEstatusRi:',this.listaEstatusRi);
      }
    });
  }

}
