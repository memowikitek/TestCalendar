import { SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TablePaginatorSearch, Vista } from 'src/app/utils/models';
import { DependenciaAreaDTOV1 } from 'src/app/utils/models/dependencia-area.dto.v1';
import { DependencyAreaRecordService } from './modals/dependency-area-record/dependency-area-record.service';
import { DependencyAreaService } from 'src/app/core/services/api/dependency-area/dependency-area.service';
import { UsersService } from 'src/app/core/services';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Alert, convertByteArrayToBlob, setDataPaginator } from 'src/app/utils/helpers';
import { Router } from '@angular/router';
import { ModulesCatalogDTO } from 'src/app/utils/models/modules-catalog.dto';
import { saveAs } from 'file-saver';

@Component({
    selector: 'app-dependency-area',
    templateUrl: './dependency-area.component.html',
    styleUrls: ['./dependency-area.component.scss'],
    standalone: false
})
export class DependencyAreaComponent implements OnInit {
    @ViewChild('input', { static: true }) inputSearch: ElementRef;
    @ViewChild('paginator', { static: true }) readonly paginator: MatPaginator;
    data: DependenciaAreaDTOV1[];
    selection: SelectionModel<DependenciaAreaDTOV1>;
    disabled: boolean;
    permission: boolean;
    filters: TablePaginatorSearch;
    pageIndex: number;
    pageSize: number;
    length: number;
    thisAccess: Vista;
    thisModule: ModulesCatalogDTO;
    permissions: boolean[];

    constructor(
        private router: Router,
        private readonly dependenciaRecord: DependencyAreaRecordService,
        private readonly dependenciaareas: DependencyAreaService,
        private users: UsersService
    ) {
        this.data = [];
        this.selection = new SelectionModel<DependenciaAreaDTOV1>(true);
        this.disabled = null;
        this.permission = null;
        this.filters = new TablePaginatorSearch();
        this.thisAccess = new Vista();
        this.permissions = [false, false, false];
    }

    ngOnInit(): void {
        this.setPermissions();
        this.pageSize = 5;
        this.pageIndex = this.filters.pageNumber;
        this.filters.pageSize = 5;
        this.filters.filter = {};
        this.getAllDependenciaAreas(this.filters);
    }

    editDependenciaArea(data: DependenciaAreaDTOV1): void {
        this.dependenciaRecord
            .open({ data: data })
            .afterClosed()
            .subscribe((result) => {
                this.getAllDependenciaAreas(this.filters);
            });
    }

    deleteDependenciaAreaByConfimation(data: DependenciaAreaDTOV1): void {
        Alert.confirm('Eliminar la dependencia de área', `¿Deseas eliminar la dependencia de área?`).subscribe(
            (result) => {
                if (!result || !result.isConfirmed) {
                    return;
                }
                this.deleteDependenciaArea(data);
            }
        );
    }

    openDependenciaAreaRecord(): void {
        this.dependenciaRecord
            .open()
            .afterClosed()
            .subscribe(() => this.getAllDependenciaAreas(this.filters));
    }

    paginatorChange(event: PageEvent): void {
        this.filters.pageSize = event.pageSize;
        this.filters.pageNumber = event.pageIndex;
        this.getAllDependenciaAreas(this.filters);
    }

    getAllDependenciaAreasExcel(): void {
        this.dependenciaareas
            .getAllDependenciaAreasExcel(this.filters)
            .subscribe((response) => saveAs(response, 'DependenciasAreas.xlsx'));
    }

    disableDependenciaArea(data: DependenciaAreaDTOV1): void {
        const msg = `Dependencia de Área ${data.activo ? 'inactivado' : 'activado'} correctamente`;
        this.dependenciaareas.disableDependenciaArea(data.id, !data.activo).subscribe((response) => {
            if (response.exito) {
                Alert.success('', msg);
                this.getAllDependenciaAreas(this.filters);
            } else {
                console.error(response.mensaje);
                Alert.error('', `No se puede ${!data.activo ? 'Deshabilitar' : 'Habilitar'} la Dependencia de Área`);
            }
        });
    }

    private deleteDependenciaArea(data: DependenciaAreaDTOV1): void {
        this.dependenciaareas.deleteDependenciaArea(data.id).subscribe(() => {
            Alert.success('', 'Dependencia de Area eliminada correctamente');
            this.filters.pageNumber = 1;
            this.paginator.firstPage();
            this.getAllDependenciaAreas(this.filters);
        });
    }

    private getAllDependenciaAreas(filters: TablePaginatorSearch): void {
        this.data = [];
        this.dependenciaareas.getAllDependenciaAreas(filters).subscribe((response) => {
            if (response.data) {
                //this.data = response.output.map((region) => new DependenciaAreaDTOV1().deserialize(region));
                this.data = response.data;
                this.pageIndex = response.paginationResult.pageNumber;
                this.pageSize = response.paginationResult.pageSize;
                this.length = response.paginationResult.totalRecords;
            }
        });
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        if (filterValue.length > 2 || filterValue.length == 0) {
            this.filters.filter = {
                nombre: filterValue.trim().toLowerCase(),
                dependenciaArea: filterValue.trim().toLowerCase(),
                areaCorporativa: filterValue.trim().toLowerCase(),
            };
            this.filters.pageNumber = 0;
            this.pageIndex = this.filters.pageNumber;
            this.getAllDependenciaAreas(this.filters);
        }
    }

    private setPermissions(): void {
        this.permissions = this.thisAccess.getPermissions(
            this.users.userSession.modulos,
            this.users.userSession.vistas,
            this.router.url
        );
    }

    checkPermission(p: number): boolean {
        return this.permissions[p];
    }
}
