import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { SubindicatorMiService, UsersService } from 'src/app/core/services';
import { Alert, convertByteArrayToBlob, setDataPaginator } from 'src/app/utils/helpers';
import { TablePaginatorSearch, SubIndicadorMIDTOV1, Vista } from 'src/app/utils/models';
import { SubIndicatorMiRecordService } from './modals';
import { ModuleIdV2 } from 'src/app/utils/enums/modules-idV2';
import { Router } from '@angular/router';
import { ModulesCatalogDTO } from 'src/app/utils/models/modules-catalog.dto';
import { saveAs } from 'file-saver';
import { BasicNotification } from 'src/app/utils/helpers/basicNotification';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

@Component({
    selector: 'app-sub-indicators-mi',
    templateUrl: './sub-indicators-mi.component.html',
    styleUrls: ['./sub-indicators-mi.component.scss'],
})
export class SubIndicatorsMiComponent implements OnInit {
    @ViewChild('input', { static: true }) inputSearch: ElementRef;
    @ViewChild('paginator', { static: true }) readonly paginator: MatPaginator;
    dataSource: MatTableDataSource<SubIndicadorMIDTOV1>;
    filters: TablePaginatorSearch;
    data: SubIndicadorMIDTOV1[];
    thisAccess: Vista;
    thisModule: ModulesCatalogDTO;
    pageIndex: number;
    pageSize: number;
    length: number;
    disabled: boolean;
    permissions: string[];
    subIndicatorMiRecordForm: FormGroup;

    searchControl = new FormControl();

    constructor(
        private router: Router,
        private readonly subIndicatorMiRecordService: SubIndicatorMiRecordService,
        private readonly subindicatorMiService: SubindicatorMiService,
        private users: UsersService,
        private readonly formBuilder: FormBuilder,
        private basicNotification : BasicNotification,
        private access : Vista,
    ) {
        this.dataSource = new MatTableDataSource<SubIndicadorMIDTOV1>([]);
        this.dataSource.filterPredicate = function (record: SubIndicadorMIDTOV1, filter: string): boolean {
            return (
                record.clave.toLowerCase().includes(filter.toLowerCase()) ||
                record.nombre.toLowerCase().includes(filter.toLowerCase())
            );
        };
        this.data = [];
        this.filters = new TablePaginatorSearch();
        this.thisAccess = new Vista();
        this.permissions = [];

        this.subIndicatorMiRecordForm = this.formBuilder.group({
            busqueda: [null],
            
      
          }); 
    }

    ngOnInit(): void {
        this.setPermissions();
        this.pageSize = 25;
        this.pageIndex = this.filters.pageNumber;
        this.filters.pageSize = 25;
        this.filters.filter = {};
        this.getAllSubIndicatorMi(this.filters);

        this.searchControl.valueChanges.pipe(
            debounceTime(700), // Espera 700ms después de que el usuario deja de escribir
            distinctUntilChanged() // Emitir solo si el valor es diferente del último emitido
          ).subscribe(value => {
            this.applyFilter(value);
          });

    }
    paginatorChange(event: PageEvent): void {
        this.filters.pageSize = event.pageSize;
        this.filters.pageNumber = event.pageIndex;
        this.getAllSubIndicatorMi(this.filters);
    }

    openSubIndicatorMiRecord(): void {
        this.subIndicatorMiRecordService
            .open()
            .afterClosed()
            .subscribe(() => {
                this.getAllSubIndicatorMi(this.filters);
            });
    }

    editSubIndicatorMiRecord(SubIndicatorMi: SubIndicadorMIDTOV1): void {
        this.subIndicatorMiRecordService
            .open({ data: SubIndicatorMi })
            .afterClosed()
            .subscribe(() => {
                this.getAllSubIndicatorMi(this.filters);
            });
    }

    deleteSubIndicadorMiByConfimation(subIndicador: SubIndicadorMIDTOV1): void {
        Alert.confirm('Eliminar Subindicador MI', `¿Deseas eliminar el Subindicador?`).subscribe((result) => {
            if (!result || !result.isConfirmed) {
                return;
            }
            this.deleteIndicatorMi(subIndicador);
        });
    }

    getAllSubIndicatorsExcel(): void {
        this.subindicatorMiService
            .getAllSubIndicatorMiExcel(this.filters)
            .subscribe((response) => saveAs(response, 'SubIndicadoresMI.xlsx'));
    }

    private getAllSubIndicatorMi(filter: TablePaginatorSearch) {
        this.dataSource.data = [];
        this.data = [];
        this.subindicatorMiService.getAllSubIndicatorMi(filter).subscribe((response) => {
            if (response.output) {
                this.data = response.output.map((subindicador) => new SubIndicadorMIDTOV1().deserialize(subindicador));
                this.dataSource.data = this.data;
                this.pageIndex = response.paginacion.pagina;
                this.pageSize = response.paginacion.registros;
                this.length = response.paginacion.count;
            }
        });
    }

    private deleteIndicatorMi(subIndicador: SubIndicadorMIDTOV1): void {
        this.subindicatorMiService.deleteSubIndicatorMi(subIndicador.id).subscribe((response) => {
            if (response.exito) {
                this.basicNotification.notif("success",'Subindicador MI eliminado correctamente');
                this.paginator.firstPage();
                this.getAllSubIndicatorMi(this.filters);
            } else {
                console.error(response.mensaje);
                this.basicNotification.notif("error",'No se puede eliminar el Subindicador');
            }
        });
    }
    // applyFilter(event: Event) {
    //     const filterValue = (event.target as HTMLInputElement).value;
    //     if (filterValue.length > 2 || filterValue.length == 0) {
    //         this.filters.filter = {
    //             clave: filterValue.trim().toLowerCase(),
    //             nombre: filterValue.trim().toLowerCase(),
    //         };
    //         this.paginator.firstPage();
    //         this.getAllSubIndicatorMi(this.filters);
    //         this.dataSource.filter = filterValue.trim().toLowerCase();
    //     }
    // }

    applyFilter(filterValue: any) {        
        if (filterValue.length > 2 || filterValue.length == 0) {
            this.filters.filter = {
                clave: filterValue.trim().toLowerCase(),
                nombre: filterValue.trim().toLowerCase(),
            };
            this.paginator.firstPage();
            this.getAllSubIndicatorMi(this.filters);
            this.dataSource.filter = filterValue.trim().toLowerCase();
        }
    }

    

    disableSubIndicatorMi(data: SubIndicadorMIDTOV1): void {
        const msg = `Subindicador MI ${data.activo ? 'inactivado' : 'activado'} correctamente`;
        this.subindicatorMiService.disbaleSubIndicatorMi(data.id, !data.activo).subscribe((response) => {
            // console.log(response);
            if (response.exito) {
                this.basicNotification.notif("success",msg);
                this.getAllSubIndicatorMi(this.filters);
            } else {
                console.error(response.mensaje);
                this.basicNotification.notif("error",`No se puede ${!data.activo ? 'inactivar' : 'activar'} el Subindicador MI`);
            }
        });
    }

    private setPermissions(): void {
        this.permissions = this.access.getPermissionsV2(this.users.userSession.permisosRolesVistas,this.router.url );
      
      }
      
      checkPermission(p: string): boolean {
        return this.permissions?.some(r => r.trim() == p.trim())
      }
}
