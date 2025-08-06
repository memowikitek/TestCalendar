import { Component, EventEmitter, Input, OnInit, Output, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { MatDrawer } from '@angular/material/sidenav';
import { EvaluationCycleService, InstitutionService, RegionsService, ProcesoEvaluacionService, UsersService } from 'src/app/core/services';
import { InstitucionDTOV1, RegionDTOV1, ProcesoEvaluacionDTO, TablePaginatorSearch } from 'src/app/utils/models';
import { CicloCeEvaluacionAll } from 'src/app/utils/models/ciclo-evaluacion-indicadores.dto';
//import tipo from 'src/assets/data/tipoRespuesta.json';

export class Parametros {
  CampusIds: number[];
  NivelModalidadIds: number[];
}

@Component({
  selector: 'app-parameters-control',
  templateUrl: './parameters-control.component.html',
  styleUrl: './parameters-control.component.scss'
})
export class ParametersControlComponent implements OnInit {
  @ViewChild('drawer') drawer: MatDrawer | undefined;
  @Output() aplicarParametros = new EventEmitter<any>();
  @Input() cc: any;
  @Input() pantalla: any;
  filters: TablePaginatorSearch;
  pageIndex: number;
  pageSize: number;
  length: number;
  parametros: Parametros;
  FilterForm: FormGroup;
  dataAll: CicloCeEvaluacionAll[];
  //Listas
  listaCampus: any;
  listaAR: any;
  listaSubarea: any;
  listaTR: any //= tipo;
  listaNivel: any;
  listaEstatusRi: any;
  listaProcesoEva: any;
  listaResCon: any;
  listaRegion: any;
  listaInstitucion: any;
  listaEstatus: any;
  //Campos
  campus: any;
  areaResp: any;
  resCon: any;
  procesoEva: any;
  region: any;
  institucion: any;
  estatus: any;
  //Mostrar
  verCampus = false;
  verAreaResposable = false;
  verResCon = true;
  verProcesoEva = true;
  verRegion = true;
  verInstitucion = true;
  verEstatus = true;
  //
  cicloEvaluacionId = 0;
  cicloEva :any;
  tipoUser: any;
  revIns: any;

  constructor(private readonly formBuilder: FormBuilder,
    private readonly EvaCService: EvaluationCycleService,
    private readonly institution: InstitutionService,
    private readonly regions: RegionsService,
    private readonly procesoEvaluacion: ProcesoEvaluacionService,
    private users: UsersService
  ) {
    this.tipoUser = users.userSession.tipoRol;
    this.FilterForm = this.formBuilder.group({
      campus: [null, []],
      resCon: [null, []],
      procesoEva: [null, []],
      areaResp: [null, []],
      region: [null, []],
      institucion: [null, []],
      estatus: [null, []]
    });
  }
  
  ngOnChanges(changes: SimpleChanges) {
    if (changes.cc) {console.log('El valor del componente padre ha cambiado '+ this.cc);
      if (this.cc){
        this.FilterForm.get(this.cc).setValue(null);
        this.aplicarFiltro();
        if (this.drawer) { this.drawer.toggle(); }  
      }
    }
  }

  ngOnInit(): void {
    this.revIns = JSON.parse(localStorage.getItem('revIns'));
    this.getLists();
  }

  paramsAll(data: any) {
    const val = data;//console.log('data:',val);
    if (val && val[0] === 0) { val.splice(0, 1) }//console.log(val);
    return val;
  }

  aplicarFiltro() {
    this.campus = this.paramsAll(this.FilterForm.get('campus').value);
    this.areaResp = this.paramsAll(this.FilterForm.get('areaResp').value);

    this.resCon = this.paramsAll(this.FilterForm.get('resCon').value);
    this.procesoEva = this.paramsAll(this.FilterForm.get('procesoEva').value);
    this.region = this.paramsAll(this.FilterForm.get('region').value);
    this.institucion = this.paramsAll(this.FilterForm.get('institucion').value);
    this.estatus = this.paramsAll(this.FilterForm.get('estatus').value);

    const NombreCampus = (this.campus) ? (this.campus.length >= 1 && this.campus.length <= this.listaCampus.length) ? this.campus : null : null;
    const NombreArea = (this.areaResp) ? (this.areaResp.length >= 1 && this.areaResp.length <= this.listaAR.length) ? this.areaResp : null : null;
    
    const NombreResCon = (this.resCon) ? (this.resCon.length > 1) ? null : this.resCon[0] : null;
    const NombreProcesoEva = (this.procesoEva) ? (this.procesoEva.length >= 1 && this.procesoEva.length <= this.listaProcesoEva.length) ? this.procesoEva : null : null;
    const NombreRegion = (this.region) ? (this.region.length >= 1 && this.region.length <= this.listaRegion.length) ? this.region : null : null;
    const NombreInstitucion = (this.institucion) ? (this.institucion.length >= 1 && this.institucion.length <= this.listaInstitucion.length) ? this.institucion : null : null;
    const Activo = (this.estatus) ? (this.estatus.length > 1) ? null : this.estatus[0] : null;

    const params = {
      NombreCampus,
      NombreArea,
      NombreResCon,
      NombreProcesoEva,
      NombreRegion,
      NombreInstitucion,
      Activo
    }; console.log(params);

    if (this.drawer) {
      this.drawer.toggle();
    }
    this.aplicarParametros.emit(params);

  }

  toggleAllSelection(campo: any) {
    if (campo === 'campus') {
      let ids = this.listaCampus.map((ids: any) => ids.campusId);
      ids = (this.FilterForm.controls.areaResp.value.length === (ids.length - 1)) ? [] : [0].concat(ids);
      this.FilterForm.controls.campus.setValue(ids);
    }
    if (campo === 'areaResp') {
      let ids = this.listaAR.map((ids: any) => ids.areaId);
      ids = (this.FilterForm.controls.areaResp.value.length === (ids.length - 1)) ? [] : [0].concat(ids);
      this.FilterForm.controls.areaResp.setValue(ids);
    }

    if (campo === 'region') {
      let ids = this.listaRegion.map((ids: any) => ids.areaId);
      ids = (this.FilterForm.controls.region.value.length === (ids.length - 1)) ? [] : [0].concat(ids);
      this.FilterForm.controls.region.setValue(ids);
    }
    if (campo === 'institucion') {
      const allSelected = this.FilterForm.controls.institucion.value.length === this.listaInstitucion.length; //console.log(this.FilterForm.controls.institucion.value.length,this.listaInstitucion.length,allSelected);
      this.FilterForm.controls.institucion.patchValue(allSelected ? [] : [0, ...this.listaInstitucion.map((item: { clave: any; }) => item.clave)]); //console.log([0,...this.campusList.map(item => item.id)]);
    }
    if (campo === 'resCon') {
      const allSelected = this.FilterForm.controls.resCon.value.length === 2; //console.log(this.FilterForm.controls.estatus.value.length,2,allSelected);
      this.FilterForm.controls.resCon.patchValue(allSelected ? [] : [0, true, false]); //console.log([0,...this.campusList.map(item => item.id)]);  
    }
    if (campo === 'procesoEva') {
      const allSelected = this.FilterForm.controls.procesoEva.value.length === this.listaProcesoEva.length; //console.log(this.FilterForm.controls.institucion.value.length,this.listaInstitucion.length,allSelected);
      this.FilterForm.controls.procesoEva.patchValue(allSelected ? [] : [0, ...this.listaProcesoEva.map((item: { clave: any; }) => item.clave)]); //console.log([0,...this.campusList.map(item => item.id)]);  
    }
    if (campo === 'estatus') {
      const allSelected = this.FilterForm.controls.estatus.value.length === 2; //console.log(this.FilterForm.controls.estatus.value.length,2,allSelected);
      this.FilterForm.controls.estatus.patchValue(allSelected ? [] : [0, true, false]); //console.log([0,...this.campusList.map(item => item.id)]);  
    }
  }

  applyFilterParams(params: any): void {
    this.filters.filter = params;
    this.filters.pageNumber = 0;
    this.pageIndex = this.filters.pageNumber;
  }

  CleanFilters(c: any) {
    if (c == 'all') {
      this.FilterForm.get('campus').setValue(null);
      this.FilterForm.get('areaResp').setValue(null);
      this.FilterForm.get('resCon').setValue(null);
      this.FilterForm.get('procesoEva').setValue(null);
      this.FilterForm.get('region').setValue(null);
      this.FilterForm.get('institucion').setValue(null);
      this.FilterForm.get('estatus').setValue(null);
    } else {
      this.FilterForm.get(c).setValue(null);
      // this.aplicarFiltro();
      // if (this.drawer) {
      //   this.drawer.toggle();
      // }
    }

    const NombreCampus: any = null;
    const NombreArea: any = null;
    const NombreResCon: any = null;
    const NombreProcesoEva: any = null;
    const NombreInstitucion: any = null;
    const NombreRegion: any = null;
    const Activo: any = null;

    const paramsC = {
      NombreCampus,
      NombreArea,
      NombreResCon,
      NombreProcesoEva,
      NombreRegion,
      NombreInstitucion,
      Activo
    };console.log('paramsC:',paramsC);

    if (this.drawer) {
      this.drawer.toggle();
    }
    this.aplicarParametros.emit(paramsC);
  }

  onSelectionChange(event: MatSelectChange, campo: any) {
    let val = event.value;
    if (campo === 'campus') {
      this.FilterForm.controls.campus.setValue(event.value);
    }
    if (campo === 'areaResp') {
      this.FilterForm.controls.areaResp.setValue(event.value);
    }

    if (campo === 'resCon') {
      this.FilterForm.controls.resCon.setValue(event.value);
    }
    if (campo === 'procesoEva') {
      this.FilterForm.controls.procesoEva.setValue(event.value);
    }
    if (campo === 'region') {
      this.FilterForm.controls.region.setValue(event.value);
    }
    if (campo === 'institucion') {
      this.FilterForm.controls.institucion.setValue(event.value);
    }
    if (campo === 'estatus') {
      this.FilterForm.controls.estatus.setValue(event.value);
    }
  }

  toggle() {
    this.drawer.toggle();
  }

  //CATALOGOS
  getLists(){
    if(this.pantalla === 'campusNM'){
      this.verResCon = false;
      this.verProcesoEva = false;
      this.verRegion = false;
      this.verInstitucion = true;
    }
    if(this.pantalla === 'areaResCampus'){
      this.verResCon = false;
      this.verProcesoEva = false;
      this.verRegion = false;
      this.verInstitucion = true;
    }
    if(this.pantalla === 'indicadores'){
      this.verResCon = false;
      this.verProcesoEva = true;
      this.verRegion = false;
      this.verInstitucion = false;
    }

    if(this.verInstitucion){this.getAllInstitutions();}
    if(this.verRegion){this.getAllRegions();}
    if(this.verProcesoEva){this.getAllProcesosEvaluacion();}
  }
  
  getAllInstitutions() {
    const filters = new TablePaginatorSearch();
    filters.filter = { activo: true };
    filters.pageSize = 100;
    this.institution.getAllInstitutions(filters).subscribe((response) => {
        if (response.output) {
          this.listaInstitucion = response.output.map((region) => new InstitucionDTOV1().deserialize(region));
        }
    });
  }

  getAllRegions() {
    const filters = new TablePaginatorSearch();
    this.regions.getAllRegions(filters).subscribe((response) => {
        if (response.output) {
          this.listaRegion = response.output.map((region) => new RegionDTOV1().deserialize(region));
        }
    });
  }

  getAllProcesosEvaluacion() {
    const filters = new TablePaginatorSearch();
    filters.pageSize = 999999;
    this.procesoEvaluacion.getAllProcesosEvaluacion(filters).subscribe((response) => {
        if (response.exito) {
            this.listaProcesoEva = response.output.filter((p) => p.activo).map((p) => new ProcesoEvaluacionDTO().deserialize(p)); //
            console.log(this.listaProcesoEva);
            /*if(this.userData){
                for(var i=0; i < this.userData.data.procesosEvaluacionRol.length; i++){
                    let item = this.procesoEvaluacionList.find(item=>item.id == this.userData.data.procesosEvaluacionRol[i].procesoEvaluacionId);
                    this.procesosEvaluacionRol.controls[i].get("procesoEvaluacion").patchValue(item);
                }
            }*/
        }
    });
  }
}
