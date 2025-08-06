import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TablePaginatorSearch, Vista } from 'src/app/utils/models';
import { CriteriosEvaluacionDTO } from 'src/app/utils/models/criterios-evaluacion.dto';
import { EvaluationCriteriaIrService } from 'src/app/core/services/api/evaluation-criteria-ir/evaluation-criteria-ir.service';
import { UsersService } from 'src/app/core/services';
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { ModulesCatalogDTO } from 'src/app/utils/models/modules-catalog.dto';
import { MatDrawer } from '@angular/material/sidenav';
import { MatSelectChange } from '@angular/material/select';
import { CriteriaRecordService } from './modals/criteria-record/criteria-record.service';
import { filter } from 'rxjs';
import { BasicNotification } from 'src/app/utils/helpers/basicNotification';
import { CriteriaRecordComponent, ModalTitle } from './modals/criteria-record/criteria-record.component';
import { saveAs } from 'file-saver';
import * as moment from 'moment';
import { debug } from 'console';
import { disableDebugTools } from '@angular/platform-browser';

@Component({
  selector: 'app-evaluation-criteria-ir',
  templateUrl: './evaluation-criteria-ir.component.html',
  styleUrls: ['./evaluation-criteria-ir.component.scss']
})
export class EvaluationCriteriaIrComponent {
  data: CriteriosEvaluacionDTO[];
  dataSource = new MatTableDataSource<any>([]);
  selection: SelectionModel<CriteriosEvaluacionDTO>;
  disabled: boolean;
  permission: boolean;
  filters: TablePaginatorSearch;
  permissions: string[];
  pageIndex = 0;
  pageSize = 25;
  length = 0;
  thisAccess: Vista;
  thisModule: ModulesCatalogDTO;
  searchForm: FormGroup;
  evaluationCriteriaRecordForm: FormGroup;
  criterioFilterForm: FormGroup;
  criterio: any;
  listaCriterios: any;
  @ViewChild('drawer') drawer: MatDrawer;
  
  cicloFilterForm: FormGroup;
  listaCiclo: any[] = [];
  listaEtapa: any[] = [];
  @ViewChild('input', { static: true }) inputSearch: ElementRef;
  @ViewChild('paginator', { static: true }) readonly paginator: MatPaginator;

  ciclo: any;
  etapa: any;
  estatus: any;

  constructor(
    private readonly criterioRecord: CriteriaRecordService,
    private readonly criteriosEvaluacion: EvaluationCriteriaIrService,
    private router: Router,
    private access : Vista,
    private users: UsersService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private basicNotification: BasicNotification,
  ) {
      this.selection = new SelectionModel<CriteriosEvaluacionDTO>(true);
      this.disabled = null;
      this.permission = null;
      this.filters = new TablePaginatorSearch();
      this.thisAccess = new Vista();
      this.permissions = [];

      this.evaluationCriteriaRecordForm = this.formBuilder.group({
          busqueda: [null],
      }); 
      this.cicloFilterForm = this.formBuilder.group({
        cicloEvaluacion: [[]],
        etapa: [[]],
        activo: [null, []],
      });
  }

  ngOnInit(): void {
    this.setPermissions();
    this.pageSize = 25;
    this.pageIndex = this.filters.pageNumber;
    this.filters.pageSize = 25;
    this.filters.filter = {};
    this.searchForm = this.formBuilder.group({
      busqueda: new FormControl()
    });
    this.getAllCriterios(this.filters);
    this.getAllEvaluationCycles();
    this.getAllAplicablePhasesToECIR();
  }

  aplicarFiltro() {
    const cicloEvaluacion = this.ciclo = this.cicloFilterForm.get('cicloEvaluacion').value;
    const etapa = this.etapa = this.cicloFilterForm.get('etapa').value;
    const activo = this.estatus = this.cicloFilterForm.get('activo').value;  
    const cicloEvaluacionIds = cicloEvaluacion && cicloEvaluacion.length && cicloEvaluacion !== 'all'
      ? cicloEvaluacion.map((value: any) => Number(value))
      : null;  
    const etapaIds = etapa && etapa.length && etapa !== 'all'
      ? etapa.map((value: any) => Number(value))
      : null;  
    const params = {
      CicloEvaluacionIds: cicloEvaluacionIds,
      EtapaIds: etapaIds,
      Activo: activo
    };  
    this.applyFilterParams(params); console.log(this.ciclo, this.etapa, this.estatus);
  }
  
  

  applyFilterParams(params: any): void{
    this.filters.filter = params;
    this.filters.pageNumber = 0;
    this.pageIndex = this.filters.pageNumber;
    console.log(this.filters);
    this.getAllCriterios(this.filters);
    if (this.drawer) {
      this.drawer.toggle();
    }
  }
  
  paramsAll(data: any){
    const val = data;
    if(val && val[0] === 0){ val.splice(0, 1) }
    return val;
  }

  openCriterioRecord(): void {
    this.criterioRecord
            .open()
            .afterClosed()
            .subscribe(() => this.getAllCriterios(this.filters));
  }

  editCriterio(row: CriteriosEvaluacionDTO): void {
    this.criterioRecord
            .open( row )
            .afterClosed()
            .subscribe(() => this.getAllCriterios(this.filters));
  }

  disableCriterio(row: CriteriosEvaluacionDTO): void {
    row.activo = !row.activo;
    const msg = `Criterio ${!row.activo ? 'desactivado' : 'activado'} correctamente`;
    this.criteriosEvaluacion.disableEvaluationCriteria(row.id, row.activo).subscribe((response) => {
        if (response.exito) {
            this.basicNotification.notif("success",msg);
            this.getAllCriterios(this.filters);
        } else {
            console.error(response.mensaje);
            this.basicNotification.notif("error",`No se puede ${!row.activo ? 'desactivar' : 'activar'} el Criterio`);
        }
    });
  }

  getAllCriteriosExcel(): any {
    const currentDate = moment().format('YYYYMMDD');
    const fileName = 'CriteriosDeRevisionInstitucional.xlsx';
  
    this.criteriosEvaluacion.getAllEvaluationCriteriasExcel(this.filters).subscribe((response) => {
      saveAs(response, fileName);
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (filterValue.length > 2 || filterValue.length == 0) {
      this.filters.filter = {
        CriterioRevision: filterValue.trim().toLowerCase(),
      };
      this.filters.pageNumber = 0;
      this.pageIndex = this.filters.pageNumber;
      this.getAllCriterios(this.filters);
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
  }

  btnCleanFilters(c:any){
    if(c=='all'){
      this.criterioFilterForm.get('criterio').setValue(null);
      this.cicloFilterForm.get('cicloEvaluacion').patchValue([]);
      this.cicloFilterForm.get('etapa').patchValue([]);
      this.cicloFilterForm.get('activo').setValue(null);
    }
    else if(c=='cicloEvaluacion'){
      this.cicloFilterForm.get('cicloEvaluacion').patchValue([]);
      this.aplicarFiltro();
      if (this.drawer) {
        this.drawer.toggle();
      }
    }
    else if(c=='etapa'){
      this.cicloFilterForm.get('etapa').patchValue([]);
      this.aplicarFiltro();
      if (this.drawer) {
        this.drawer.toggle();
      }
    }
    else if(c=='estatus'){
      this.cicloFilterForm.get('activo').setValue(null);
      this.aplicarFiltro();
      if (this.drawer) {
        this.drawer.toggle();
      }
    }
    else{
      this.criterioFilterForm.get(c).setValue(null);
      this.aplicarFiltro();
      if (this.drawer) {
        this.drawer.toggle();
      }
    }
  }
  
  toggleAllSelection(campo: any) {
    if(campo === 'criterio'){
      const allSelected = this.criterioFilterForm.controls.criterio.value.length === this.listaCriterios.length;
      this.criterioFilterForm.controls.criterio.patchValue(allSelected ? [] : [0,...this.listaCriterios.map((item: { criterioEvaluacion: any; }) => item.criterioEvaluacion)]);
    }
  }

  clearFilters() {
    this.cicloFilterForm.reset();
    this.aplicarFiltro();
  }

  toggleAllCiclos(selected: boolean) {
    if (selected) {
      const allCiclos = this.listaCiclo.map(ciclo => ciclo.value);
      this.cicloFilterForm.get('cicloEvaluacion').patchValue(allCiclos);
    } else {
      this.cicloFilterForm.get('cicloEvaluacion').patchValue([]);
    }
  }

  toggleAllEtapas(selected: boolean) {
    if (selected) {
      const allEtapas = this.listaEtapa.map(etapa => etapa.etapaId);
      this.cicloFilterForm.get('etapa').patchValue(allEtapas);
    } else {
      this.cicloFilterForm.get('etapa').patchValue([]);
    }
  }

  paginatorChange(event: any): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.filters.pageSize = this.pageSize;
    this.filters.pageNumber = this.pageIndex;
    this.getAllCriterios(this.filters);
  }

  private setPermissions(): void {
    this.permissions = this.access.getPermissionsV2(this.users.userSession.permisosRolesVistas,this.router.url );
  
  }
  
  checkPermission(p: string): boolean {
    return this.permissions?.some(r => r.trim() == p.trim())
  }

  private getAllCriterios(filter: TablePaginatorSearch) {
    this.dataSource.data = [];
    this.data = [];
    const params = {
      EtapaIds: filter.filter.etapaIds,
      CicloEvaluacionIds: filter.filter.cicloEvaluacionIds
    };

    this.criteriosEvaluacion.getAllEvaluationCriterias(filter).subscribe((response) => {
      if (response.output) {
        this.data = response.output.map((criteriosEvaluacion) => new CriteriosEvaluacionDTO().deserialize(criteriosEvaluacion));
        this.dataSource.data = this.data;
        this.pageIndex = response.paginacion.pagina;
        this.pageSize = response.paginacion.registros;
        this.length = response.paginacion.count;
      }
    });
  }


  private getAllEvaluationCycles(): void {
    const filters = new TablePaginatorSearch();
    filters.pageSize = 999999;
    const procesoEvaluacionId = 1;
    this.criteriosEvaluacion.getAllCriteriaEvaluacionCycle(filters, procesoEvaluacionId).subscribe((response) => {
      if (!response.output) {
        return;
      }
      this.listaCiclo = response.output.map((item: any) => {
        return {
          id: item.cicloEvaluacionId,
          cicloEvaluacion: item.cicloEvaluacion,
        };
      });
    });
  }

  private getAllAplicablePhasesToECIR(): void {
    const filters = { filter: { 'AplicaCriterioEvaluacion': true } };
    this.criteriosEvaluacion.getAllAplicablePhasesToECIR(filters).subscribe((response: any) => {
      if (!response.output) {
        return;
      }
      this.listaEtapa = response.output.map((item: any) => {
        return {
          id: item.id,
          etapa: item.clave + ': ' + item.nombre,
        };
      });
    });
  }
  
  toggleAll(controlName: string, list: any[]) {
    const control = this.cicloFilterForm.get(controlName);
    if (control.value.length === list.length) {
      control.setValue([]);
    } else {
      control.setValue(list.map(item => item[controlName]));
    }
  }
  onSelectionChange(event: any, controlName: string) {
    const control = this.cicloFilterForm.get(controlName);
    const selectedOptions = event.value;
  
    if(controlName === 'activo')
    {
      control.patchValue(selectedOptions);
    }
    else if (selectedOptions.includes('all')) {
      if (control.value.length === event.source.options.length - 1) {
        control.setValue([]);
      } else {
        const allValues = event.source.options.map((option: any) => option.value).filter((value: any) => value !== 'all');
        control.setValue(allValues);
      }
    }
  }
  
}
