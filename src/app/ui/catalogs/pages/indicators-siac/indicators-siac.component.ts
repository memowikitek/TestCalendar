import { SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { UsersService } from 'src/app/core/services';
import { IndicatorSiacService } from 'src/app/core/services/api/indicator-siac/indicator-siac.service';
import { Alert, convertByteArrayToBlob, setDataPaginator } from 'src/app/utils/helpers';
import { IndicadorSiacDTO, IndicadorSiacDTOV1, TablePaginatorSearch, Vista } from 'src/app/utils/models';
import { IndicatorSiacRecordService } from './modals';
import { ModuleIdV2 } from 'src/app/utils/enums/modules-idV2';
import { Router } from '@angular/router';
import { ModulesCatalogDTO } from 'src/app/utils/models/modules-catalog.dto';
import { saveAs } from 'file-saver';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-indicators-siac',
    templateUrl: './indicators-siac.component.html',
    styleUrls: ['./indicators-siac.component.scss'],
})
export class IndicatorsSiacComponent implements OnInit {
    @ViewChild('input', { static: true }) inputSearch: ElementRef;
    @ViewChild('paginator', { static: true }) readonly paginator: MatPaginator;
    data: IndicadorSiacDTOV1[];
    dataSource: MatTableDataSource<IndicadorSiacDTOV1>;
    selection: SelectionModel<IndicadorSiacDTOV1>;
    disabled: boolean;
    permission: boolean;
    filters: TablePaginatorSearch;
    pageIndex: number;
    pageSize: number;
    length: number;
    thisAccess: Vista;
    thisModule: ModulesCatalogDTO;
    permissions: boolean[];
    private searchsub$ = new Subject<string>();
    constructor(
        private router: Router,
        private readonly indicatorSiacRecord: IndicatorSiacRecordService,
        private readonly indicatorSiacService: IndicatorSiacService,
        private users: UsersService
    ) {
        this.data = [];
        this.dataSource = new MatTableDataSource<IndicadorSiacDTOV1>([]);
        // this.dataSource.filterPredicate = function (data: IndicadorSiacDTOV1, filter: string): boolean {
        //     return (
        //         data.clave.toLowerCase().includes(filter.toLowerCase()) ||
        //         data.nombre.toLowerCase().includes(filter.toLowerCase()) ||
        //         data.descripcion.toLowerCase().toString().includes(filter.toLowerCase())
        //     );
        // };
        this.selection = new SelectionModel<IndicadorSiacDTOV1>(true);
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
        this.getAllIndicatorsSiac(this.filters);

        this.searchsub$.pipe(debounceTime(300), distinctUntilChanged()).subscribe((filtervalue: string) => {
            this.filters.filter = {
                clave: filtervalue.trim().toLowerCase(),
                nombre: filtervalue.trim().toLowerCase(),
                descripcion: filtervalue.trim().toLowerCase(),
            };

            this.filters.pageNumber = 0;
            this.pageIndex = this.filters.pageNumber;
            this.getAllIndicatorsSiac(this.filters);
        });
    }

    openIndicatorSiacRecord(): void {
        this.indicatorSiacRecord
            .open()
            .afterClosed()
            .subscribe(() => this.getAllIndicatorsSiac(this.filters));
    }

    paginatorChange(event: PageEvent): void {
        this.filters.pageSize = event.pageSize;
        this.filters.pageNumber = event.pageIndex;
        this.getAllIndicatorsSiac(this.filters);
    }

    getAllIndicatorSiacExcel(): void {
        this.indicatorSiacService
            .getAllIndicadorSiacExcel(this.filters)
            .subscribe((response) => saveAs(response, 'IndicadorSIAC.xlsx'));
    }

    editIndicatorSiac(indicador: IndicadorSiacDTOV1): void {
        this.indicatorSiacRecord
            .open({ data: indicador })
            .afterClosed()
            .subscribe(() => {
                this.getAllIndicatorsSiac(this.filters);
            });
    }

    disableIndicatorSiac(data: IndicadorSiacDTOV1): void {
        const msg = `Indicador ${data.activo ? 'inactivado' : 'activado'} correctamente`;
        this.indicatorSiacService.disableIndicatorSiac(data.id, !data.activo).subscribe((response) => {
            if (response.exito) {
                Alert.success('', msg);
                this.getAllIndicatorsSiac(this.filters);
            } else {
                console.error(response.mensaje);
                Alert.error('', `No se puede ${!data.activo ? 'Deshabilitar' : 'Habilitar'} el Indicador SIAC`);
            }
        });
    }

    getComponente(indicadorSiac: IndicadorSiacDTOV1): string {
        if (indicadorSiac.elementoEvaluacion !== null) {
            if (indicadorSiac.elementoEvaluacion.componente !== null)
                return `${indicadorSiac.elementoEvaluacion.componente.clave} - ${indicadorSiac.elementoEvaluacion.componente.nombre}`;
            else return '';
        } else return '';
    }

    deleteIndicatorSiacByConfimation(indicadorSiac: IndicadorSiacDTOV1): void {
        Alert.confirm('Eliminar indicador SIAC', `¿Deseas eliminar el Indicador SIAC?`).subscribe((result) => {
            if (!result || !result.isConfirmed) {
                return;
            }
            this.deleteIndicatorSiac(indicadorSiac);
        });
    }

    private deleteIndicatorSiac(indicadorSiac: IndicadorSiacDTOV1): void {
        this.indicatorSiacService.deleteIndicatorSiac(indicadorSiac.id).subscribe((response) => {
            if (response.exito) {
                Alert.success('', 'Indicador SIAC eliminado correctamente');
                this.paginator.firstPage();
                this.getAllIndicatorsSiac(this.filters);
            } else {
                console.error(response.mensaje);
                Alert.error('', 'No se puede eliminar la Indicador SIAC');
            }
        });
    }

    private getAllIndicatorsSiac(filters: TablePaginatorSearch): void {
        this.dataSource.data = [];
        this.data = [];
        this.indicatorSiacService.getAllIndicatorsSiac(filters).subscribe((response) => {
            if (response.output) {
                this.data = response.output.map((indicadorSiac) => new IndicadorSiacDTOV1().deserialize(indicadorSiac));
                this.dataSource.data = this.data;
                this.pageIndex = response.paginacion.pagina;
                this.pageSize = response.paginacion.registros;
                this.length = response.paginacion.count;
            }
        });
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.searchsub$.next(filterValue);
        // if (filterValue.length > 2 || filterValue.length == 0) {
        //     this.filters.filter = {
        //         clave: filterValue.trim().toLowerCase(),
        //         nombre: filterValue.trim().toLowerCase(),
        //         descripcion: filterValue.trim().toLowerCase(),
        //     };
        //     this.paginator.firstPage();
        //     this.getAllIndicatorsSiac(this.filters);
        //     this.dataSource.filter = filterValue.trim().toLowerCase();
        // }
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
