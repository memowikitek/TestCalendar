import { SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { UsersService } from 'src/app/core/services';
import { Alert, setDataPaginator } from 'src/app/utils/helpers';
import { NivelDTOV1, TablePaginatorSearch, Vista } from 'src/app/utils/models';
import { ModuleIdV2 } from 'src/app/utils/enums/modules-idV2';
import { LevelRecordService } from './modals';
import { LevelService } from 'src/app/core/services/api/level/level.service';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';

@Component({
    selector: 'app-level',
    templateUrl: './level.component.html',
    styleUrls: ['./level.component.scss'],
    standalone: false
})
export class LevelComponent implements OnInit {
    @ViewChild('input', { static: true }) inputSearch: ElementRef;
    @ViewChild('paginator', { static: true }) readonly paginator: MatPaginator;
    data: NivelDTOV1[];
    dataSource: MatTableDataSource<NivelDTOV1>;
    selection: SelectionModel<NivelDTOV1>;
    disabled: boolean;
    permission: boolean;
    filters: TablePaginatorSearch;
    pageIndex: number;
    pageSize: number;
    length: number;
    thisAccess: Vista;
    permissions: boolean[];
    constructor(
        private router: Router,
        private readonly levelRecord: LevelRecordService,
        private readonly level: LevelService,
        private users: UsersService
    ) {
        this.data = [];
        this.dataSource = new MatTableDataSource<NivelDTOV1>([]);
        this.dataSource.filterPredicate = function (record: NivelDTOV1, filter: string): boolean {
            return record.nombre.toLowerCase().includes(filter.toLowerCase());
        };
        this.selection = new SelectionModel<NivelDTOV1>(true);
        this.disabled = null;
        this.permission = null;
        this.filters = new TablePaginatorSearch();
        this.thisAccess = new Vista();
        this.permissions = [false, false, false];
    }

    ngOnInit(): void {
        this.setPermissions();
        this.disabled = !this.checkPermission(2);
        this.pageSize = 25;
        this.pageIndex = this.filters.pageNumber;
        this.filters.pageSize = 25;
        this.filters.filter = {};
        this.getAllLevel(this.filters);
    }

    editLevel(level: NivelDTOV1): void {
        this.levelRecord
            .open({ data: level })
            .afterClosed()
            .subscribe(() => this.getAllLevel(this.filters));
    }

    disableLevel(data: NivelDTOV1): void {
        const msg = `Nivel ${data.activo ? 'inactivado' : 'activado'} correctamente`;
        this.level.disableLevel(data.id, !data.activo).subscribe((response) => {
            if (response.exito) {
                Alert.success('', msg);
                this.getAllLevel(this.filters);
            } else {
                console.error(response.mensaje);
                Alert.error('', `No se puede ${!data.activo ? 'Deshabilitar' : 'Habilitar'} el Nivel`);
            }
        });
    }

    deleteLevelByConfimation(level: NivelDTOV1): void {
        Alert.confirm('Eliminar Nivel', `¿Deseas eliminar el Nivel?`).subscribe((result) => {
            if (!result || !result.isConfirmed) {
                return;
            }
            this.deleteLevel(level);
        });
    }

    openLevelRecord(): void {
        this.levelRecord
            .open()
            .afterClosed()
            .subscribe(() => this.getAllLevel(this.filters));
    }

    paginatorChange(event: PageEvent): void {
        this.filters.pageSize = event.pageSize;
        this.filters.pageNumber = event.pageIndex;
        this.getAllLevel(this.filters);
    }

    getAllLevelExcel(): void {
        this.level.getAllLevelExcel(this.filters).subscribe((response) => saveAs(response, 'Nivel.xlsx'));
    }

    private deleteLevel(level: NivelDTOV1): void {
        this.level.deleteLevel(level.id).subscribe(() => {
            this.paginator.firstPage();
            this.getAllLevel(this.filters);
            Alert.success('', 'Nivel eliminado correctamente');
        });
    }

    private getAllLevel(filters: TablePaginatorSearch): void {
        this.dataSource.data = [];
        this.data = [];
        this.level.getAllLevel(filters).subscribe((response) => {
            if (response.output) {
                this.data = response.output.map((level) => new NivelDTOV1().deserialize(level));
                this.dataSource.data = this.data;
                this.pageIndex = response.paginacion.pagina;
                this.pageSize = response.paginacion.registros;
                this.length = response.paginacion.count;
            }
        });
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        if (filterValue.length > 2 || filterValue.length == 0) {
            this.filters.filter = {
                nombre: filterValue.trim().toLowerCase(),
            };
            this.paginator.firstPage();
            this.getAllLevel(this.filters);
            this.dataSource.filter = filterValue.trim().toLowerCase();
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
