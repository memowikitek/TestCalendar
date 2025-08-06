import { Component, ElementRef, OnInit, ViewChild, NgModule  } from '@angular/core';
import {MatPaginator, MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { AuditService } from 'src/app/core/services';
import {  UsersService } from 'src/app/core/services';
import { AuditDTOV1,TablePaginatorSearch, Vista } from 'src/app/utils/models';
import { AuditRecordService } from './modals/audit-record/audit-records.service';
import { Router } from '@angular/router';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Alert } from 'src/app/utils/helpers';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BasicNotification } from 'src/app/utils/helpers/basicNotification';

@Component({
  selector: 'app-audits',
  templateUrl: './audits.component.html',
  styleUrls: ['./audits.component.scss'],
})

export class AuditsComponent implements OnInit {
  //@ViewChild('input', { static: true }) inputSearch: ElementRef;
  @ViewChild('paginator', { static: true }) readonly paginator: MatPaginator;
  auditRecordForm: FormGroup;
    dataSource: MatTableDataSource<AuditDTOV1>;
  displayedColumns: string[] = ['id', 'nombre', 'activo', 'totalIndicadores', 'edit'];
  datos: AuditDTOV1[];
  pageIndex: number;
  pageSize: number;
  length: number;
  data: AuditDTOV1[];
  filters: TablePaginatorSearch;
  isChecked: any;
  permissions: string[];

  searchControl = new FormControl();
 
  i: any;

    constructor(
    private router: Router,  
    private readonly audits: AuditService,
    private readonly auditsRecord: AuditRecordService,
    private users: UsersService,
    private readonly formBuilder: FormBuilder,
    private basicNotification : BasicNotification,
    private access : Vista,
    ) {

      this.permissions = null;
      this.data = [];
      this.dataSource = new MatTableDataSource<AuditDTOV1>([]);
      this.dataSource.filterPredicate = function (audit: AuditDTOV1, filter: string): boolean {
          return (
              audit.nombre.toLowerCase().includes(filter.toLowerCase()) 
          );
      };

      this.auditRecordForm = this.formBuilder.group({
        busqueda: [null],
        
  
      }); 

      this.filters = new TablePaginatorSearch();

     }
  
  
    ngOnInit(): void {
      this.setPermissions();
      this.pageSize = 25;
      this.pageIndex = this.filters.pageNumber;
      this.filters.pageSize = 25;
      this.filters.filter = {};
      this.getAllAudits(this.filters);
      // fromEvent(this.inputSearch.nativeElement, 'keyup')
      //     .pipe(
      //         map((event: any) => event.target.value),
      //         debounceTime(1000),
      //         distinctUntilChanged()
      //     )
      //     .subscribe((text: string) => {
      //         this.search(text);
      //     });

      this.searchControl.valueChanges.pipe(
        debounceTime(700), // Espera 700ms después de que el usuario deja de escribir
        distinctUntilChanged() // Emitir solo si el valor es diferente del último emitido
      ).subscribe(value => {console.log(value);
        this.applyFilter(value);
      });
  }


  editAudit(audits: AuditDTOV1): void {
      this.auditsRecord
          .open({ data: audits })
          .afterClosed()
          .subscribe(() => this.getAllAudits(this.filters));
  }

    
  private getAllAudit(filters: TablePaginatorSearch): void {
    this.dataSource.data = [];
    this.data = [];
    this.audits.getAllAudits(filters).subscribe((response) => {
      this.data = response.output.map((audit) => new AuditDTOV1().deserialize(audit));
      console.log(this.data);
      this.dataSource = new MatTableDataSource(this.data);    
      this.pageIndex = response.paginacion.pagina;
      this.pageSize = response.paginacion.registros;
      this.length = response.paginacion.count;
    });
  }

  paginatorChange(event: PageEvent): void {
    this.filters.pageSize = event.pageSize;
    this.filters.pageNumber = event.pageIndex;
    this.getAllAudit(this.filters);
  }
  search(term: string): void {
    this.dataSource.filter = term;
    this.paginator.pageIndex = 0;
    this.dataSource.paginator = this.paginator;
  }

  private getAllAudits(filters: TablePaginatorSearch): void {
    this.dataSource.data = [];
    this.data = [];
    this.audits.getAllAudits(filters).subscribe((response) => {
        if (response.output) {
            this.data = response.output.map((audit) => new AuditDTOV1().deserialize(audit));
            this.dataSource.data = this.data;
            this.pageIndex = response.paginacion.pagina;
            this.pageSize = response.paginacion.registros;
            this.length = response.paginacion.count;
        }
    });
  }

  private deleteCorporate(audit: AuditDTOV1): void {
    this.audits.deleteAudit(audit.id).subscribe((response) => {
        if (response.exito) {
            this.basicNotification.notif("success",'Proceso de evaluación eliminado correctamente', 7000);
            this.paginator.firstPage();
            this.getAllAudits(this.filters);
        } else {
            console.error(response.mensaje);
            this.basicNotification.notif("error",'No se puede eliminar el Proceso de evaluación');

        }
    });
}

  openAuditRecord(): void {
    this.auditsRecord
        .open()
        .afterClosed()
        .subscribe(() => this.getAllAudit(this.filters));
  }

  // applyFilter(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   if (filterValue.length >= 0 || filterValue.length == 0) {
  //       this.filters.filter = {
  //           nombre: filterValue.trim().toLowerCase(),
  //       };
  //       this.filters.pageNumber = 0;
  //       this.pageIndex = this.filters.pageNumber;
  //       this.getAllAudits(this.filters);
  //       this.dataSource.filter = filterValue.trim().toLowerCase();
  //   }
  // }

  applyFilter(filterValue: any) {    
    if (filterValue.length >= 0 || filterValue.length == 0) {
        this.filters.filter = {
            nombre: filterValue.trim().toLowerCase(),
        };
        this.filters.pageNumber = 0;
        this.pageIndex = this.filters.pageNumber;
        this.getAllAudits(this.filters);
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }
  }

  onChange($event: any, id: number) {
      this.isChecked = $event.checked ;
      const auditoria: AuditDTOV1 = new AuditDTOV1();
      auditoria.id = id;
      auditoria.activo = this.isChecked;
      this.audits.updateAudit(
      auditoria
        ).subscribe((response) => {
        if (response.exito) {
          this.basicNotification.notif("success",`Proceso de evaluación  ${ this.isChecked? 'activado' : 'inactivado'} correctamente`);

            this.getAllAudits(this.filters);

        } else {
            this.basicNotification.notif("error", `Proceso de evaluación ${!this.isChecked ? 'inactivado' : 'activado'} correctamente`);
          }
    });
  }
  
  deleteCoporateAreaByConfimation(audit: AuditDTOV1): void {
    Alert.confirm('Eliminar Proceso de evaluación', `¿Deseas eliminar el proceso de evaluación?`).subscribe((result) => {
        if (!result || !result.isConfirmed) {
            return;
        }
        this.deleteCorporate(audit);
    });
}


private setPermissions(): void {
  this.permissions = this.access.getPermissionsV2(this.users.userSession.permisosRolesVistas,this.router.url );

}

checkPermission(p: string): boolean {
  return this.permissions?.some(r => r.trim() == p.trim())
}

}

