import { SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { UsersService } from 'src/app/core/services';
import { Alert, convertByteArrayToBlob, setDataPaginator } from 'src/app/utils/helpers';
import { TablePaginatorSearch, Vista } from 'src/app/utils/models';
import { SubAreaCorporativaDTOV1 } from 'src/app/utils/models/subarea-corporativa.dto.v1';
import { CorporateSubAreaRecordService } from './modals/corporate-subarea-record/corporate-subarea-record.service';
import { CorporateSubAreaService } from 'src/app/core/services/api/corporate-subarea/corporate-subarea.service';
import { ModuleIdV2 } from 'src/app/utils/enums/modules-idV2';
import { Router } from '@angular/router';
import { ModulesCatalogDTO } from 'src/app/utils/models/modules-catalog.dto';
import { saveAs } from 'file-saver';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BasicNotification } from 'src/app/utils/helpers/basicNotification';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

@Component({
    selector: 'app-corporate-subareas',
    templateUrl: './corporate-subareas.component.html',
    styleUrls: ['./corporate-subareas.component.scss'],
    standalone: false
})
export class CorporateSubAreasComponent implements OnInit {
    @ViewChild('input', { static: true }) inputSearch: ElementRef;
    @ViewChild('paginator', { static: true }) readonly paginator: MatPaginator;
    data: SubAreaCorporativaDTOV1[];
    dataSource: MatTableDataSource<SubAreaCorporativaDTOV1>;
    selection: SelectionModel<SubAreaCorporativaDTOV1>;
    disabled: boolean;
    permission: boolean;
    filters: TablePaginatorSearch;
    pageIndex: number;
    pageSize: number;
    length: number;
    thisAccess: Vista;
    thisModule: ModulesCatalogDTO;
    permissions: string[];
    corporateSubareaRecordForm: FormGroup;

    searchControl = new FormControl();

    constructor(
        private router: Router,
        private readonly corporateSubAreaRecord: CorporateSubAreaRecordService,
        private readonly corporateSubArea: CorporateSubAreaService,
        private users: UsersService,
        private readonly formBuilder: FormBuilder,
        private basicNotification : BasicNotification,
        private access : Vista,
    ) {
        this.data = [];
        this.dataSource = new MatTableDataSource<SubAreaCorporativaDTOV1>([]);
        this.selection = new SelectionModel<SubAreaCorporativaDTOV1>(true);
        this.dataSource.filterPredicate = function (record: SubAreaCorporativaDTOV1, filter: string): boolean {
            return (
                record.siglas.toLowerCase().includes(filter.toLowerCase()) ||
                record.nombre.toLowerCase().includes(filter.toLowerCase()) ||
                record.areaCentral.toLowerCase().includes(filter.toLowerCase())
            );
        };
        this.disabled = null;
        this.permission = null;
        this.filters = new TablePaginatorSearch();
        this.thisAccess = new Vista();
        this.permissions = [];

        this.corporateSubareaRecordForm = this.formBuilder.group({
            busqueda: [null],
            
      
          }); 
    }

    ngOnInit(): void {
        this.setPermissions();
        this.pageSize = 25;
        this.pageIndex = this.filters.pageNumber;
        this.filters.pageSize = 25;
        this.filters.filter = {};
        this.getAllCorporateSubAreas(this.filters);

        this.searchControl.valueChanges.pipe(
            debounceTime(700), // Espera 700ms después de que el usuario deja de escribir
            distinctUntilChanged() // Emitir solo si el valor es diferente del último emitido
          ).subscribe(value => {
            this.applyFilter(value);
          });

    }

    editCorporateArea(areaCorporativa: SubAreaCorporativaDTOV1): void {
        this.corporateSubAreaRecord
            .open({ data: areaCorporativa })
            .afterClosed()
            .subscribe(() => this.getAllCorporateSubAreas(this.filters));
    }

    paginatorChange(event: PageEvent): void {
        this.filters.pageSize = event.pageSize;
        this.filters.pageNumber = event.pageIndex;
        this.getAllCorporateSubAreas(this.filters);
    }

    openCorporateRecord(): void {
        this.corporateSubAreaRecord
            .open()
            .afterClosed()
            .subscribe(() => this.getAllCorporateSubAreas(this.filters));
    }

    deleteCoporateAreaByConfimation(areaCorporativa: SubAreaCorporativaDTOV1): void {
        Alert.confirm('Eliminar Area Central', `¿Deseas eliminar el Area Central?`).subscribe((result) => {
            if (!result || !result.isConfirmed) {
                return;
            }
            this.deleteCorporateSubArea(areaCorporativa);
        });
    }

    disableCorporateArea(data: SubAreaCorporativaDTOV1): void {
        const msg = `Subárea Central ${data.activo ? 'inactivado' : 'activado'} correctamente`;
        this.corporateSubArea.disableCorpporateArea(data.id, !data.activo).subscribe((response) => {
            if (response.exito) {
                this.basicNotification.notif("success",msg );
                this.getAllCorporateSubAreas(this.filters);
            } else {
                console.error(response.mensaje);
                this.basicNotification.notif("error",`No se puede ${!data.activo ? 'inactivar' : 'activar'} el Área Central`);
            }
        });
    }

    

    private deleteCorporateSubArea(areaCorporativa: SubAreaCorporativaDTOV1): void {
        this.corporateSubArea.deleteCorporateSubArea(areaCorporativa.id).subscribe((response) => {
            if (response.exito) {
                this.getAllCorporateSubAreas(this.filters);
                this.basicNotification.notif("success",'Subarea Central eliminada correctamente');
            } else {
                console.error(response.mensaje);
                this.basicNotification.notif("error",'No se puede eliminar la Subarea');
            }
        });
    }

    private getAllCorporateSubAreas(filters: TablePaginatorSearch): void {
        this.dataSource.data = [];
        this.data = [];
        this.corporateSubArea.getAllCorporateSubAreas(filters).subscribe((response) => {
            if (response.output) {
                this.data = response.output.map((areacoroporativa) =>
                    new SubAreaCorporativaDTOV1().deserialize(areacoroporativa)
                );
                this.dataSource.data = this.data;
                this.pageIndex = response.paginacion.pagina;
                this.pageSize = response.paginacion.registros;
                this.length = response.paginacion.count;
            }
        });
    }

    getAllCoporateAreasExcel(): void {
        this.corporateSubArea
            .getAllCorpoateSubAreaExcel(this.filters)
            .subscribe((response) => saveAs(response, 'SubAreasCentrales.xlsx'));
    }

    // applyFilter(event: Event) {
    //     const filterValue = (event.target as HTMLInputElement).value;
    //     if (filterValue.length > 2 || filterValue.length == 0) {
    //         this.filters.filter = {
    //             nombre: filterValue.trim().toLowerCase(),
    //             dependenciaArea: filterValue.trim().toLowerCase(),
    //             areaCorporativa: filterValue.trim().toLowerCase(),
    //         };
    //         this.filters.pageNumber = 0;
    //         this.pageIndex = this.filters.pageNumber;
    //         this.getAllCorporateSubAreas(this.filters);
    //         this.dataSource.filter = filterValue.trim().toLowerCase();
    //     }
    // }

    applyFilter(filterValue: any) {        
        if (filterValue.length > 2 || filterValue.length == 0) {
            this.filters.filter = {
                nombre: filterValue.trim().toLowerCase(),
                dependenciaArea: filterValue.trim().toLowerCase(),
                areaCorporativa: filterValue.trim().toLowerCase(),
            };
            this.filters.pageNumber = 0;
            this.pageIndex = this.filters.pageNumber;
            this.getAllCorporateSubAreas(this.filters);
            this.dataSource.filter = filterValue.trim().toLowerCase();
        }
    }

    private setPermissions(): void {
        this.permissions = this.access.getPermissionsV2(this.users.userSession.permisosRolesVistas,this.router.url );
      
      }
      
      checkPermission(p: string): boolean {
        return this.permissions?.some(r => r.trim() == p.trim())
      }
}
