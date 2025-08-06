import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormArray, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Alert, clearForm } from 'src/app/utils/helpers';
import { BasicNotification } from 'src/app/utils/helpers/basicNotification';
import { DatePipe } from '@angular/common';
import { MatDrawer } from '@angular/material/sidenav';
import { NotificationsSettingsRecordService } from './modals';
import { NotificationsService, CampusService, ResponsibilityAreasService, UsersService } from 'src/app/core/services';
import { NotificacionesAllDTO, TablePaginatorSearch } from 'src/app/utils/models';
import { MatSelectChange } from '@angular/material/select';
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
    selector: 'app-my-notifications-settings',
    templateUrl: './my-notifications-settings.component.html',
    styleUrls: ['./my-notifications-settings.component.scss'],
    providers: [DatePipe] // Agregar DatePipe como provider
    ,
    standalone: false
})
export class MyNotificationsSettingsComponent implements OnInit {
  @ViewChild('drawer') drawer: MatDrawer | undefined;
  @ViewChild('input', { static: true }) inputSearch: ElementRef;
  @ViewChild('paginator', { static: true }) readonly paginator: MatPaginator;
  FilterForm: FormGroup;
  displayedColumns: string[] = ['cicloEvaluacionDescripcion', 'titulo', 'fechaCreacion', 'fechaEnvio', 'usuarioEnvioNombre', 'destinatarios', 'estatusDescripcion', 'edit'];
  data: NotificacionesAllDTO[];
  dataSource: MatTableDataSource<NotificacionesAllDTO>;
  filters: TablePaginatorSearch;
  pageIndex: number;
  pageSize: number;
  length: number;
  dataAll: NotificacionesAllDTO[];
  //Fechas
  fecIni: any;
  fecFin: any;
  limitDate = new Date();
  //Listas
  listaCampus: any;
  listaAR: any;
  listaEstatus: any;
  //Campos
  campus: any;
  areaResp: any;
  estatus: any;

  searchControl = new FormControl();

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly campusS: CampusService,
    private readonly areasS: ResponsibilityAreasService,
    private readonly RecordService: NotificationsSettingsRecordService,
    private readonly NotiService: NotificationsService,
    private basicNotification: BasicNotification,
    private users: UsersService,
    private datePipe: DatePipe
  ) {
    this.dataSource = new MatTableDataSource<NotificacionesAllDTO>([]);
    this.filters = new TablePaginatorSearch();
    this.FilterForm = this.formBuilder.group({
      fechaInicio: [null, []],
      fechaFin: [null, []],
      campus: [null, []],
      areaResp: [null, []],
      estatus: [null, []]
    });
  }

  ngOnInit(): void {
    this.limitDate.setDate(this.limitDate.getDate() - 30);
    this.pageSize = 25;
    this.pageIndex = this.filters.pageNumber;
    this.filters.pageSize = 25;
    this.filters.filter = {};
    this.getAllNotifications(this.filters);
    this.getCeEvaluacionList();//Listas

    this.searchControl.valueChanges.pipe(
      debounceTime(700), // Espera 700ms después de que el usuario deja de escribir
      distinctUntilChanged() // Emitir solo si el valor es diferente del último emitido
    ).subscribe(value => {
      this.applyFilter(value);
    });

  }

  //METHODS
  private getAllNotifications(filters: TablePaginatorSearch): void {
    this.dataSource.data = [];
    this.data = [];
    this.NotiService.getAllNotifications(filters).subscribe((response) => {
      if (response.output) {
        this.data = response.output.map((res) => new NotificacionesAllDTO().deserialize(res)); //console.log('NotificacionesData:', this.data);
        this.dataSource.data = this.data;
        this.pageIndex = response.paginacion.pagina;
        this.pageSize = response.paginacion.registros;
        this.length = response.paginacion.count;
      }
    });
  }

  private getCeEvaluacionList() {
    let filters = new TablePaginatorSearch();
    filters.filter = {};
    filters.pageSize = 999999;
    filters.pageNumber = 0;
    this.NotiService.getAllNotifications(filters).subscribe((response) => {
      if (response.output) {
        this.dataAll = response.output.map((res) => new NotificacionesAllDTO().deserialize(res));//console.log('NotificacionesDataAll:', this.dataAll);
        this.getUniqueCiclosIds(this.dataAll);
      }
    });
  }

  paginatorChange(event: PageEvent): void {
    this.filters.pageSize = event.pageSize;
    this.filters.pageNumber = event.pageIndex;
    this.getAllNotifications(this.filters);
  }

  //Buscador
  applyFilter(filterValue: any) {    
    if (filterValue.length > 2 || filterValue.length == 0) {
      this.filters.filter = { searchTerm: filterValue.trim().toLowerCase() };
      this.filters.pageNumber = 0;
      this.pageIndex = this.filters.pageNumber;
      this.getAllNotifications(this.filters);
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
  }

  //CATALOGOS
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

  getCatEstatusIds() {
    this.NotiService.getEstatus().subscribe((response) => {
      if (response.output) {
        this.listaEstatus = response.output;
      }
    });
  }

  getUniqueCiclosIds(arr: any) {
    const resIdSet = new Set<number>();
    arr.forEach((item: { cicloEvaluacionId: number; }) => {
      if (item.cicloEvaluacionId) {
        resIdSet.add(item.cicloEvaluacionId);
      }
    });
    const uniqueIds = Array.from(resIdSet); //console.log('uniqueIds:', uniqueIds);
    this.getCatCampusIds(uniqueIds);
    this.getCatAreaResIds(uniqueIds);
    this.getCatEstatusIds();
  }

  //Parametros
  aplicarFiltro() {//console.log('Click Filtro');
    this.fecIni = this.FilterForm.get('fechaInicio').value;
    this.fecFin = this.FilterForm.get('fechaFin').value;
    this.campus = this.paramsAll(this.FilterForm.get('campus').value);//console.log('campus:',this.campus);
    this.areaResp = this.paramsAll(this.FilterForm.get('areaResp').value);//console.log('areaResp:',this.areaResp);
    this.estatus = this.paramsAll(this.FilterForm.get('estatus').value);//console.log('estatus:',this.estatus);
    const fechaInicio = (this.fecIni) ? this.fecIni : null;
    const fechaFin = (this.fecFin) ? this.fecFin : null;
    const campusesId = (this.campus) ? (this.campus.length >= 1 && this.campus.length <= this.listaCampus.length) ? this.campus : null : null;
    const areasResponsablesId = (this.areaResp) ? (this.areaResp.length >= 1 && this.areaResp.length <= this.listaAR.length) ? this.areaResp : null : null;
    const estatusesId = (this.estatus) ? (this.estatus.length >= 1 && this.estatus.length <= this.listaEstatus.length) ? this.estatus : null : null;

    const params = {
      fechaInicio,
      fechaFin,
      campusesId,
      areasResponsablesId,
      estatusesId
    }
    console.log(params);
    this.applyFilterParams(params);
  }

  applyFilterParams(params: any): void {
    this.filters.filter = params;
    this.filters.pageNumber = 0;
    this.pageIndex = this.filters.pageNumber;
    this.getAllNotifications(this.filters);
    if (this.drawer) {
      this.drawer.toggle();
    }
  }

  paramsAll(data: any) {
    const val = data;
    if (val && val[0] === 0) { val.splice(0, 1) }//console.log(val);
    return val;
  }

  btnCleanFilters(c: any) {
    if (c == 'all') {
      this.FilterForm.get('fechaInicio').setValue(null);
      this.FilterForm.get('fechaFin').setValue(null);
      this.FilterForm.get('campus').setValue(null);
      this.FilterForm.get('areaResp').setValue(null);
      this.FilterForm.get('estatus').setValue(null);
    } else if (c == 'fechas') {
      this.FilterForm.get('fechaInicio').setValue(null);
      this.FilterForm.get('fechaFin').setValue(null);
      this.aplicarFiltro();
      if (this.drawer) {
        this.drawer.toggle();
      }
    } else {
      this.FilterForm.get(c).setValue(null);
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
    if (campo === 'estatus') {
      if (val.length <= this.listaEstatus.length) {
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
    if (campo === 'estatus') {
      const allSelected = this.FilterForm.controls.estatus.value.length === this.listaEstatus.length; //console.log(this.FilterForm.controls.estatus.value.length,2,allSelected);
      this.FilterForm.controls.estatus.patchValue(allSelected ? [] : [0, ...this.listaEstatus]); //console.log([0,...this.campusList.map(item => item.id)]);  
    }
  }

  /*BTN ACTIONS*/
  //Cancel
  cancelRow(row: any): void {
    Alert.confirm('Cancelar notificación', '¿Desea cancelar la notificación?').subscribe((result) => {
      if (!result || !result.isConfirmed) { return; }
      console.log(row.id);
      this.NotiService.cancelNotification(row.id).subscribe((response) => {
        if (response.exito) {
          this.basicNotification.notif("success", 'Notificación cancelada correctamente');
          this.getAllNotifications(this.filters);
        }
      });
    });
  }
  //Delete ***Derogada
  deleteRow(row: any): void {
    Alert.confirm('Eliminar notificación', '¿Desea eliminar la notificación?').subscribe((result) => {
      if (!result || !result.isConfirmed) { return; }
      console.log(row.id);
      this.NotiService.deleteNotification(row.id).subscribe((response) => {
        if (response.exito) {
          this.basicNotification.notif("success", 'Notificación eliminada correctamente');
          this.getAllNotifications(this.filters);
        }
      });
    });
  }

  //MODALs
  openRecord(): void {
    this.RecordService
      .open()
      .afterClosed()
      .subscribe(() => this.getAllNotifications(this.filters));
  }

  /*editRecord(dataS: any): void { console.log(dataS);
    this.RecordService
      .open({ data: dataS })
      .afterClosed()
      .subscribe(() => this.getAllNotifications(this.filters));
  }*/

  editRecord(dataS: any): void {
    var dataSComplete = new NotificacionesAllDTO();
    this.NotiService.getNotificacionById(dataS.id).subscribe((response) => {
      if (response.output) {
        var dataList = response.output.map((res) => new NotificacionesAllDTO().deserialize(res));
        dataSComplete = dataList[0];
        this.RecordService
          .open({ data: dataSComplete })
          .afterClosed()
          .subscribe(() => this.getAllNotifications(this.filters));
      }
    });
  }

  showRecord(dataS: any): void {
    var dataSComplete = new NotificacionesAllDTO();
    this.NotiService.getNotificacionById(dataS.id).subscribe((response) => {
      if (response.output) {
        var dataList = response.output.map((res) => new NotificacionesAllDTO().deserialize(res));
        dataSComplete = dataList[0];
        dataSComplete.esVista = true;
        this.RecordService
          .open({ data: dataSComplete })
          .afterClosed()
          .subscribe(() => { dataSComplete.esVista = false; });
      }
    });
    /*dataS.esVista = true;
    this.RecordService
      .open({ data: dataS })
      .afterClosed()
      .subscribe(() => { dataS.esVista = false; });
    */
  }

  duplicarRecord(dataS: any): void {
    var dataSComplete = new NotificacionesAllDTO();
    this.NotiService.getNotificacionById(dataS.id).subscribe((response) => {
      if (response.output) {
        var dataList = response.output.map((res) => new NotificacionesAllDTO().deserialize(res));
        dataSComplete = dataList[0];
        dataSComplete.duplicar = true;
        this.RecordService
          .open({ data: dataSComplete })
          .afterClosed()
          .subscribe(() => { dataSComplete.duplicar = false;this.getAllNotifications(this.filters); });
      }
    });
    /*dataS.duplicar = true;
    this.RecordService
      .open({ data: dataS })
      .afterClosed()
      .subscribe(() => this.getAllNotifications(this.filters));
    */
  }

  obtenerFechaFormateada(fecha: string): string {
    return this.datePipe.transform(fecha, 'dd/MM/yyyy') || '';
  }

  notiTrack(row: any) {
    console.log(row);
    localStorage.setItem('notiTrack', JSON.stringify(row));
    window.location.assign('/notifications-tracking');
  }
}
