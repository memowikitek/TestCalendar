import { SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { UsersService } from 'src/app/core/services';
import { CorporateAreaService } from 'src/app/core/services/api/coporate-area/corporate-area.service';
import { Alert, convertByteArrayToBlob, setDataPaginator } from 'src/app/utils/helpers';
import { AreaCorporativaDTO, AreaCorporativaDTOV1, TablePaginatorSearch, Vista } from 'src/app/utils/models';
import { CoporateAreaRecordService } from './modals';
import { ModuleIdV2 } from 'src/app/utils/enums/modules-idV2';
import { ModulesCatalogDTO } from 'src/app/utils/models/modules-catalog.dto';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { ThemePalette } from '@angular/material/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BasicNotification } from 'src/app/utils/helpers/basicNotification';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

@Component({
    selector: 'app-corporate-areas',
    templateUrl: './corporate-areas.component.html',
    styleUrls: ['./corporate-areas.component.scss'],
    standalone: false
})
export class CorporateAreasComponent implements OnInit {
    @ViewChild('input', { static: true }) inputSearch: ElementRef;
    @ViewChild('paginator', { static: true }) readonly paginator: MatPaginator;
    data: AreaCorporativaDTOV1[];
    dataSource: MatTableDataSource<AreaCorporativaDTOV1>;
    selection: SelectionModel<AreaCorporativaDTOV1>;
    disabled: boolean;
    permission: boolean;
    filters: TablePaginatorSearch;
    pageIndex: number;
    pageSize: number;
    length: number;
    thisAccess: Vista;
    thisModule: ModulesCatalogDTO;
    permissions: string[];
    color: ThemePalette = 'primary';
    corporateAreasRecordForm: FormGroup;

    searchControl = new FormControl();

    constructor(
        private router: Router,
        private readonly corporateAreaRecord: CoporateAreaRecordService,
        private readonly corporateArea: CorporateAreaService,
        private users: UsersService,
        private readonly formBuilder: FormBuilder,
        private basicNotification : BasicNotification,
        private access : Vista,
    ) {
        this.data = [];
        this.dataSource = new MatTableDataSource<AreaCorporativaDTOV1>([]);
        this.dataSource.filterPredicate = function (record: AreaCorporativaDTOV1, filter: string): boolean {
            return record.nombre.toLowerCase().includes(filter.toLowerCase());
        };
        this.selection = new SelectionModel<AreaCorporativaDTOV1>(true);
        this.disabled = null;
        this.permission = null;
        this.filters = new TablePaginatorSearch();
        this.thisAccess = new Vista();
        this.permissions = [];
    }

    ngOnInit(): void {
        this.setPermissions();
        this.pageSize = 25;
        this.pageIndex = this.filters.pageNumber;
        this.filters.pageSize = 25;
        this.filters.filter = {};
        this.getAllCorporateAreas(this.filters);

        this.searchControl.valueChanges.pipe(
            debounceTime(700), // Espera 700ms después de que el usuario deja de escribir
            distinctUntilChanged() // Emitir solo si el valor es diferente del último emitido
          ).subscribe(value => {
            this.applyFilter(value);
          });

    }

    editCorporateArea(areaCorporativa: AreaCorporativaDTOV1): void {
        this.corporateAreaRecord
            .open({ data: areaCorporativa })
            .afterClosed()
            .subscribe(() => this.getAllCorporateAreas(this.filters));
    }

    paginatorChange(event: PageEvent): void {
        this.filters.pageSize = event.pageSize;
        this.filters.pageNumber = event.pageIndex;
        this.getAllCorporateAreas(this.filters);
    }

    openCorporateRecord(): void {
        this.corporateAreaRecord
            .open()
            .afterClosed()
            .subscribe(() => this.getAllCorporateAreas(this.filters));
    }

    deleteCoporateAreaByConfimation(areaCorporativa: AreaCorporativaDTOV1): void {
        Alert.confirm('Eliminar Area Central', `¿Deseas eliminar el Area Central?`).subscribe((result) => {
            if (!result || !result.isConfirmed) {
                return;
            }
            this.deleteCorporate(areaCorporativa);
        });
    }

    disableCorporateArea(data: AreaCorporativaDTOV1): void {
        const msg = `Área Central ${data.activo ? 'inactivada' : 'activada'} correctamente`;
        this.corporateArea.disableCorpporateArea(data.id, !data.activo).subscribe((response) => {
            if (response.exito) {
                // Alert.success('', msg);
                this.basicNotification.notif("success",msg);
                this.getAllCorporateAreas(this.filters);
            } else {
                console.error(response.mensaje);
                // Alert.error('', `No se puede ${!data.activo ? 'Deshabilitar' : 'Habilitar'} el Área Central`);
                this.basicNotification.notif("error",`No se puede ${!data.activo ? 'inactivar' : 'activar'} el Área Central`);
            }
        });
    }

    

    private deleteCorporate(areaCorporativa: AreaCorporativaDTOV1): void {
        this.corporateArea.deleteCorporateArea(areaCorporativa.id).subscribe((response) => {
            if (response.exito) {
                this.basicNotification.notif("success",'Área Central eliminada correctamente');
                this.paginator.firstPage();
                this.getAllCorporateAreas(this.filters);
            } else {
                console.error(response.mensaje);
                this.basicNotification.notif("error",'No se puede eliminar el área');

            }
        });
    }

    private getAllCorporateAreas(filters: TablePaginatorSearch): void {
        this.dataSource.data = [];
        this.data = [];
        this.corporateArea.getAllCorporateAreas(filters).subscribe((response) => {
            if (response.output) {
                this.data = response.output.map((areacoroporativa) =>
                    new AreaCorporativaDTOV1().deserialize(areacoroporativa)
                );
                this.dataSource.data = this.data;
                this.pageIndex = response.paginacion.pagina;
                this.pageSize = response.paginacion.registros;
                this.length = response.paginacion.count;
            }
        });
    }

    getAllCoporateAreasExcel(): void {
        this.corporateArea
            .getAllCorpoateAreaExcel(this.filters)
            .subscribe((response) => saveAs(response, 'AreasCentrales.xlsx'));
    }

    private setPermissions(): void {
        this.permissions = this.access.getPermissionsV2(this.users.userSession.permisosRolesVistas,this.router.url );
      
      }
      
      checkPermission(p: string): boolean {
        return this.permissions?.some(r => r.trim() == p.trim())
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
    //         this.getAllCorporateAreas(this.filters);
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
            this.getAllCorporateAreas(this.filters);
            this.dataSource.filter = filterValue.trim().toLowerCase();
        }
    }

}
