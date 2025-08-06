import { Component, ElementRef, OnInit, ViewChild, NgModule } from '@angular/core';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Alert } from 'src/app/utils/helpers';
import { DatePipe } from '@angular/common';
import { EvaluationCycleService, UsersService } from 'src/app/core/services';
import { CicloEvaDTOV1, CycleEvaDTOV1, TablePaginatorSearch, Vista } from 'src/app/utils/models';
import { CycleEvaluationRecordService } from './modals/cycle-record/cycle-record.service';
import { BasicNotification } from 'src/app/utils/helpers/basicNotification';
import { PermisosHeredadosDTO } from 'src/app/utils/models/permisos-heredados.dto';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-evaluation-cycle',
  templateUrl: './evaluation-cycle.component.html',
  styleUrls: ['./evaluation-cycle.component.scss'],
  providers: [DatePipe] // Agregar DatePipe como provider
})

export class EvaluationCycleComponent implements OnInit {
  @ViewChild('input', { static: true }) inputSearch: ElementRef;
  @ViewChild('paginator', { static: true }) readonly paginator: MatPaginator;
  auditRecordForm: FormGroup;
  pageIndex: number;
  pageSize: number;
  length: number;
  filters: TablePaginatorSearch;
  isChecked: any;
  i: any;
  thisAccess: Vista;
  permission: boolean;
  permissions: string[];
  //
  dataSource: MatTableDataSource<CicloEvaDTOV1>;
  displayedColumns: string[] = ['cicloEvaluacion', 'procesoEvaluacion', 'institucion', 'anio', 'ciclo', 'fechaInicio', 'fechaFin', 'activo', 'edit'];
  datos: CicloEvaDTOV1[];
  data: CicloEvaDTOV1[];

  FilterForm: FormGroup;
  searchControl = new FormControl();

  constructor(
    private router: Router,
    private readonly EvaCS: EvaluationCycleService,
    private readonly CycleEvaRecordS: CycleEvaluationRecordService,
    private users: UsersService,
    private datePipe: DatePipe,
    private basicNotification : BasicNotification,
    private access : Vista,
    private readonly formBuilder: FormBuilder,
  ) {
    this.data = [];
    this.permission = null;
    this.thisAccess = new Vista();
    this.permissions = [];
    this.dataSource = new MatTableDataSource<CicloEvaDTOV1>([]);
    this.dataSource.filterPredicate = function (eva: CicloEvaDTOV1, filter: string): boolean {
      return (
        eva.cicloEvaluacion.toLowerCase().includes(filter.toLowerCase())
      );
    };
    this.filters = new TablePaginatorSearch();

    this.FilterForm = this.formBuilder.group({
      busqueda: [null]
  });
  }

  ngOnInit(): void {
    this.setPermissions();
    this.pageSize = 25;
    this.pageIndex = this.filters.pageNumber;
    this.filters.pageSize = 25;
    this.filters.filter = {};
    this.getAllCycleEva(this.filters);
    
    this.searchControl.valueChanges.pipe(
      debounceTime(700), // Espera 700ms después de que el usuario deja de escribir
      distinctUntilChanged() // Emitir solo si el valor es diferente del último emitido
    ).subscribe(value => {
      this.applyFilter(value);
    });

    
  }

  //METHODS
  private getAllCycleEva(filters: TablePaginatorSearch): void {
    this.dataSource.data = [];
    this.data = [];
    this.EvaCS.getAllEvaluacionCycle(filters).subscribe((response) => {
      //if (response.output) {
        this.data = response.output.map((eva) => new CicloEvaDTOV1().deserialize(eva));
        console.log('ListaData:', this.data);
        this.dataSource.data = this.data;
        this.pageIndex = response.paginacion.pagina;
        this.pageSize = response.paginacion.registros;
        this.length = response.paginacion.count;  
      //}
    });
  }

  editRecords(EvaCS: CicloEvaDTOV1): void {
    this.CycleEvaRecordS
      .open({ data: EvaCS })
      .afterClosed()
      .subscribe(() => this.getAllCycleEva(this.filters));
  }

  deleteCiclo(ciclo: CycleEvaDTOV1): void {
    const id = ciclo.cicloEvaluacionId;
    Alert.confirm('Eliminar Ciclo de evaluación', `¿Deseas eliminar el Ciclo de evaluación?`).subscribe((result) => {
      if (result.isConfirmed) {
        this.EvaCS.deleteEvaluacionCycle(id).subscribe((response) => {
          if (response.exito){
            this.basicNotification.notif("success",'Ciclo de evaluación eliminado correctamente');
            this.paginator.firstPage();
            this.getAllCycleEva(this.filters);
          }else{
            console.error(response.mensaje);
            this.basicNotification.notif("error",'No se puede eliminar Ciclo de evaluación');
          }
        });
      }
    });
  }

  deleteIndicadoresCiclo(ciclo: CycleEvaDTOV1): void{
    const id = ciclo.cicloEvaluacionId;
    Alert.confirm('Eliminar indicadores del ciclo de evaluación', `¿Deseas eliminar los indicadores asociados al ciclo de evaluación?`).subscribe((result) => {
      if (result.isConfirmed) {
        this.EvaCS.deleteIndicadoresCycle(id).subscribe((response) => {
          if (response.exito){
            this.basicNotification.notif("success",'Indicadores del ciclo de evaluación eliminados correctamente');
            this.paginator.firstPage();
            this.getAllCycleEva(this.filters);
          }else{
            console.error(response.mensaje);
            this.basicNotification.notif("error",'Indicadores del ciclo de evaluación No fueron eliminados');
          }
        });
      }
    });
  }

  paginatorChange(event: PageEvent): void {
    this.filters.pageSize = event.pageSize;
    this.filters.pageNumber = event.pageIndex;
    this.getAllCycleEva(this.filters);
  }

  search(term: string): void {
    this.dataSource.filter = term;
    this.paginator.pageIndex = 0;
    this.dataSource.paginator = this.paginator;
  }

  openRecord(): void {
    console.log('Open Modal Records');
    this.CycleEvaRecordS
      .open()
      .afterClosed()
      .subscribe(() => this.getAllCycleEva(this.filters));
  }

  // applyFilter(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   if (filterValue.length >= 0 || filterValue.length == 0) {
  //     this.filters.filter = {
  //       CicloEvaluacion: filterValue.trim().toLowerCase(),
  //       //fechaInicio: filterValue.trim().toLowerCase(),
  //     };
  //    this.filters.pageNumber = 0;
  //    this.pageIndex = this.filters.pageNumber;
  //    this.getAllCycleEva(this.filters);
  //    this.dataSource.filter = filterValue.trim().toLowerCase();
  //   }
  // }

  applyFilter(filterValue: any) {    
    if (filterValue.length >= 0 || filterValue.length == 0) {
      this.filters.filter = {
        CicloEvaluacion: filterValue.trim().toLowerCase(),
        //fechaInicio: filterValue.trim().toLowerCase(),
      };
     this.filters.pageNumber = 0;
     this.pageIndex = this.filters.pageNumber;
     this.getAllCycleEva(this.filters);
     this.dataSource.filter = filterValue.trim().toLowerCase();
    }
  }

  onChange($event: any, cicloEva: any) { //console.log(id);
    this.isChecked = $event.checked; //console.log(this.isChecked);
    cicloEva.activo = this.isChecked;
    console.log(cicloEva); 
    this.EvaCS.updateEvaluacionCycle(cicloEva).subscribe((response) => { //console.log(response);
      if (response.exito) {
        const msg = `Ciclo de evaluación ${this.isChecked ? 'activado' : 'inactivado'} correctamente`;
        this.basicNotification.notif("success",msg);
        this.getAllCycleEva(this.filters);
      } else {
        this.basicNotification.notif("error",`No se puede ${!this.isChecked ? 'deshabilitar' : 'habilitar'} el ciclo`);
      }
    });
  }

  redirectEdit(cicloEva: CicloEvaDTOV1): void {
    const urlRedirect = "/evaluation-generation";
    localStorage.setItem('cicloEva', JSON.stringify(cicloEva));
    localStorage.setItem('newCiclo', JSON.stringify(false));
    this.setPermisosHeredados(urlRedirect)
    window.location.assign(urlRedirect);
  }

  redirectConfigWelcome(cicloEva: CicloEvaDTOV1): void {
    const id: any = cicloEva.cicloEvaluacionId;
    localStorage.setItem('idWelcomeUpdate', id);
    window.location.assign("/welcome-settings");
  }

  obtenerFechaFormateada(fecha: string): string {
    return this.datePipe.transform(fecha, 'MMMM dd, yyyy') || '';
  }

  private setPermissions(): void {
    this.permissions = this.access.getPermissionsV2(this.users.userSession.permisosRolesVistas,this.router.url );
  
  }
  
  checkPermission(p: string): boolean {
    return this.permissions?.some(r => r.trim() == p.trim())
  }

  setPermisosHeredados(urlRedirect : string){
    var permiso = new PermisosHeredadosDTO();
      permiso.vistaPadre = this.router.url;
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


  viewFile(file:any){ console.log(file.fpmArchivoId);
    this.EvaCS.GetAzureFile(file.fpmArchivoId).subscribe((res:any) => {
        let blob = new Blob([res], { type: 'application/pdf' });
        let pdfUrl = window.URL.createObjectURL(blob);
        var PDF_link = document.createElement('a');
        PDF_link.href = pdfUrl;
        window.open(pdfUrl, '_blank');
        PDF_link.download = file.nombreFormato;
        PDF_link.click();
    });
}

DownloadFile(file:any){ console.log(file);
    var fileExt = file.nombreArchivoFpm.split('.');
    if (fileExt.length > 1){
        this.EvaCS.GetAzureFile(file.fpmArchivoId).subscribe((res:any) => {
            saveAs(res, file.nombreArchivoFpm);
        });
    }
}

canViewFile(file:any) : boolean{ 
    if(file.nombreArchivoFpm){
        if (file.nombreArchivoFpm.toLowerCase().includes('.pdf')){
            return true;      
        }
    }
    return false
}
canDownloadFile(file:any) : boolean{
    if(file.nombreArchivoFpm){
        var fileExt = file.nombreArchivoFpm.split('.');
        if (fileExt.length < 2) 
        {
            return false;
        }
        if (!file.nombreArchivoFpm.toLowerCase().includes('.pdf')){
            return true;      
        }
    }

    return false;
}

}
