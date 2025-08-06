import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormArray, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { DatePipe } from '@angular/common';
import { MatDrawer } from '@angular/material/sidenav';
import { NotificationsService, UsersService } from 'src/app/core/services';
import { BuzonNotificacionesAllDTO, RolProcesoEvaluacionDTO, TablePaginatorSearch } from 'src/app/utils/models';
import { MatSelectChange } from '@angular/material/select';
import { RolProcesoService } from 'src/app/core/services/api/rolProcesoEvaluacion/rolProcesoEvaluacion.service'

@Component({
    selector: 'app-my-notifications-tracking',
    templateUrl: './my-notifications-tracking.component.html',
    styleUrls: ['./my-notifications-tracking.component.scss'],
    providers: [DatePipe] // Agregar DatePipe como provider
    ,
    standalone: false
})

export class MyNotificationsTrackingComponent implements OnInit {
  @ViewChild('drawer') drawer: MatDrawer | undefined;
  @ViewChild('input', { static: true }) inputSearch: ElementRef;
  @ViewChild('paginator', { static: true }) readonly paginator: MatPaginator;

  FilterForm: FormGroup;
  displayedColumns: string[] = ['estatus', 'campus', 'area', 'rol', 'usuario', 'email'];
  data: BuzonNotificacionesAllDTO[];
  dataSource: MatTableDataSource<BuzonNotificacionesAllDTO>;
  filters: TablePaginatorSearch;
  pageIndex: number;
  pageSize: number;
  length: number;
  notiTrackJson: any;
  
  //Listas
  listaCampus: any;
  listaAR: any;
  listaRoles: any;
  //Campos
  campus: any;
  areaResp: any;
  roles: any;
  estatus: any;
  //Matriz
  uniqueCampuses: any[];
  uniqueAreas: any[];
  uniqueRoles: any[];

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly NotiService: NotificationsService,
    private readonly rolesS: RolProcesoService,
    private users: UsersService,
    private datePipe: DatePipe
  ) {
    this.dataSource = new MatTableDataSource<BuzonNotificacionesAllDTO>([]);
    this.filters = new TablePaginatorSearch();
    this.FilterForm = this.formBuilder.group({
      campus: [null, []],
      areaResp: [null, []],
      roles: [null, []],
      estatus: [null, []]
    });
  }

  ngOnInit(): void {
    this.notiTrackJson = JSON.parse(localStorage.getItem('notiTrack')); //console.log(this.notiTrackJson);
    const { id, cicloEvaluacionId } = this.notiTrackJson;
    this.pageSize = 25;
    this.pageIndex = this.filters.pageNumber;
    this.filters.pageSize = 25;
    this.filters.filter = {};
    //
    this.getNotificacionId(id, this.filters);
    this.catalogos(cicloEvaluacionId);
  }

  //METHODS
  private getNotificacionId(Id: any, filters: TablePaginatorSearch): void {
    this.dataSource.data = [];
    this.data = [];
    this.NotiService.getAllBuzonByNotificacionId(Id, filters).subscribe((response) => {
      if (response.output) {
        this.data = response.output.map((res) => new BuzonNotificacionesAllDTO().deserialize(res));
        console.log('NotificacionesId:', this.data);
        this.dataSource.data = this.data;
        this.pageIndex = response.paginacion.pagina;
        this.pageSize = response.paginacion.registros;
        this.length = response.paginacion.count;
      }
    });
  }

  paginatorChange(event: PageEvent): void {
    this.filters.pageSize = event.pageSize;
    this.filters.pageNumber = event.pageIndex;
    this.getNotificacionId(this.notiTrackJson.id, this.filters);
  }

  //Buscador
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (filterValue.length > 2 || filterValue.length == 0) {
      this.filters.filter = { searchTerm: filterValue.trim().toLowerCase() };
      this.filters.pageNumber = 0;
      this.pageIndex = this.filters.pageNumber;
      this.getNotificacionId(this.notiTrackJson.id, this.filters);
      //this.dataSource.filter = filterValue.trim().toLowerCase();
    }
  }

  //Parametros
  aplicarFiltro() {
    console.log('Click Filtro');

    this.campus = this.paramsAll(this.FilterForm.get('campus').value);//console.log('campus:',this.campus);
    this.areaResp = this.paramsAll(this.FilterForm.get('areaResp').value);//console.log('areaResp:',this.areaResp);
    this.roles = this.paramsAll(this.FilterForm.get('roles').value);console.log('roles:',this.roles);
    this.estatus = this.paramsAll(this.FilterForm.get('estatus').value);//console.log('estatus:',this.estatus);

    const campusesId = (this.campus) ? (this.campus.length >= 1 && this.campus.length <= this.listaCampus.length) ? this.campus : null : null;
    const areasResponsablesId = (this.areaResp) ? (this.areaResp.length >= 1 && this.areaResp.length <= this.listaAR.length) ? this.areaResp : null : null;
    const rolesId: any = (this.roles) ? (this.roles.length >= 1 && this.roles.length <= this.listaRoles.length) ? this.roles : null : null;
    const estatus = (this.estatus) ? (this.estatus.length > 1) ? null : this.estatus[0] : null;

    const params = {
      campusesId,
      areasResponsablesId,
      rolesId,
      estatus
    }

    console.log(params);
    this.applyFilterParams(params);
  }

  applyFilterParams(params: any): void {
    this.filters.filter = params;
    this.filters.pageNumber = 0;
    this.pageIndex = this.filters.pageNumber;
    this.getNotificacionId(this.notiTrackJson.id, this.filters);
    if (this.drawer) {
      this.drawer.toggle();
    }
  }

  paramsAll(data: any) {
    const val = data;//console.log('data:',val);
    if (val && val[0] === 0) { val.splice(0, 1) }//console.log(val);
    return val;
  }

  //CATALOGOS
  private catalogos(cId: any): void {
    const cicloId = [cId]; console.log(cicloId);
    this.getAllRoles();
    this.getCatCampusIds(cicloId);
    this.getCatAreaResIds(cicloId);
  }

  getAllRoles() {
    const filters = new TablePaginatorSearch();
    filters.pageSize = 999999;
    this.rolesS.getAllRolesProcesoEvaluacion(filters).subscribe((response) => {
      if (response.exito) {
        const data = response.output.filter((rol) => rol.activo).map((rol) => new RolProcesoEvaluacionDTO().deserialize(rol));
        this.listaRoles = data; //console.log('ListasRoles:', this.listaRoles);
      }
    });
  }

  getCatCampusIds(Ids: any) {
    this.NotiService.getCampusIds(Ids).subscribe((response) => {
      if (response.output) {
        const data = response.output.filter((x: any) => x.activo);
        this.listaCampus = data; //console.log('ListasCampus:', this.listaCampus);
      }
    });
  }

  getCatAreaResIds(Ids: any) {
    this.NotiService.getAreaResponsableIds(Ids).subscribe((response) => {
      if (response.output) {
        const data = response.output.filter((x: any) => x.activo);
        this.listaAR = data; //console.log('ListasAreaResp:', this.listaAR);
      }
    });
  }

  btnCleanFilters(c: any) {
    if (c == 'all') {
      this.FilterForm.get('campus').setValue(null);
      this.FilterForm.get('areaResp').setValue(null);
      this.FilterForm.get('roles').setValue(null);
      this.FilterForm.get('estatus').setValue(null);
    } else {
      this.FilterForm.get(c).setValue(null);
      this.aplicarFiltro();
      if (this.drawer) {
        this.drawer.toggle();
      }
    }
  }

  onSelectionChange(event: MatSelectChange, campo: any) {
    let val = event.value; //console.log('Event.value',val);
    if (campo === 'campus') {
      if (val.length <= this.listaCampus.length) {
        if (val[0] === 0) {
          val.splice(0, 1);
          this.FilterForm.controls.campus.patchValue(val);
        }
      }
    }
    if (campo === 'areaResp') {
      if (val.length <= this.listaAR.length) {
        if (val[0] === 0) {
          val.splice(0, 1);
          this.FilterForm.controls.areaResp.patchValue(val);
        }
      }
    }
    if(campo === 'roles'){
      if(val.length<=this.listaRoles.length){
        if(val[0] === 0){
          val.splice(0, 1);        
          this.FilterForm.controls.roles.patchValue(val);
        }
      }
    }
    if (campo === 'estatus') {
      if (val.length <= 2) {
        if (val[0] === 0) {
          val.splice(0, 1);
          this.FilterForm.controls.estatus.patchValue(val);
        }
      }
    }
    //console.log(val);
  }

  toggleAllSelection(campo: any) {
    if (campo === 'campus') {
      const allSelected = this.FilterForm.controls.campus.value.length === this.listaCampus.length; //console.log(this.FilterForm.controls.campus.value.length,this.listaCampus.length,allSelected);
      this.FilterForm.controls.campus.patchValue(allSelected ? [] : [0, ...this.listaCampus.map((item: { id: any; }) => item.id)]); //console.log([0,...this.listaCampus.map((item: { id: any; }) => item.id)]);
    }
    if (campo === 'areaResp') {
      const allSelected = this.FilterForm.controls.areaResp.value.length === this.listaAR.length; //console.log(this.FilterForm.controls.campuses.value.length,this.campusList.length,allSelected);
      this.FilterForm.controls.areaResp.patchValue(allSelected ? [] : [0, ...this.listaAR.map((item: { id: any; }) => item.id)]); //console.log([0,...this.campusList.map(item => item.id)]);
    }
    if(campo === 'roles'){
      const allSelected = this.FilterForm.controls.roles.value.length === this.listaRoles.length; //console.log(this.FilterForm.controls.roles.value.length,this.listaRoles.length,allSelected);
      this.FilterForm.controls.roles.patchValue(allSelected ? [] : [0,...this.listaRoles.map((item: { id: any; }) => item.id)]); //console.log([0,...this.campusList.map(item => item.id)]);
    }
    if (campo === 'estatus') {
      const allSelected = this.FilterForm.controls.estatus.value.length === 2; //console.log(this.FilterForm.controls.estatus.value.length,2,allSelected);
      this.FilterForm.controls.estatus.patchValue(allSelected ? [] : [0, true, false]); //console.log([0,...this.campusList.map(item => item.id)]);  
    }
  }

  obtenerFechaFormateada(fecha: string): string {
    return this.datePipe.transform(fecha, 'dd/MM/yyyy') || '';
  }
}

