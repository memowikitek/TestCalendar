import { SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { ComponentsService, LevelModalityService, UsersService } from 'src/app/core/services';
import { WeightService } from 'src/app/core/services/api/weight/weight.service';
import { Alert, convertByteArrayToBlob, setDataPaginator } from 'src/app/utils/helpers';
import { PonderacionDTO, PonderacionDTOV1, TablePaginatorSearch, Vista } from 'src/app/utils/models';
import { WeightRecordService } from './modals';
import { ModuleIdV2 } from 'src/app/utils/enums/modules-idV2';
import { ModulesCatalogDTO } from 'src/app/utils/models/modules-catalog.dto';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';

@Component({
    selector: 'app-weights',
    templateUrl: './weights.component.html',
    styleUrls: ['./weights.component.scss'],
})
export class WeightsComponent implements OnInit {
    @ViewChild('input', { static: true }) inputSearch: ElementRef;
    @ViewChild('paginator', { static: true }) readonly paginator: MatPaginator;
    data: PonderacionDTOV1[];
    dataSource: MatTableDataSource<PonderacionDTOV1>;
    selection: SelectionModel<PonderacionDTOV1>;
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
        private readonly ponderacionRecord: WeightRecordService,
        private readonly componente: ComponentsService,
        private readonly levelModality: LevelModalityService,
        private readonly weight: WeightService,
        private users: UsersService
    ) {
        this.data = [];
        this.dataSource = new MatTableDataSource<PonderacionDTOV1>([]);
        this.dataSource.filterPredicate = function (record: PonderacionDTOV1, filter: string): boolean {
            return (
                record.nivelModalidad.toLowerCase().includes(filter.toLowerCase()) ||
                record.nombre.toLowerCase().includes(filter.toLowerCase()) ||
                record.puntuacion.toString().toLowerCase().includes(filter.toLowerCase())
            );
        };
        this.selection = new SelectionModel<PonderacionDTOV1>(true);
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
        this.getAllWeights(this.filters);
    }

    editWeights(ponderacion: PonderacionDTOV1): void {
        this.ponderacionRecord
            .open({ data: ponderacion })
            .afterClosed()
            .subscribe(() => this.getAllWeights(this.filters));
    }

    deleteWeightByConfimation(ponderacion: PonderacionDTOV1): void {
        Alert.confirm('Eliminar ponderacion', `¿Deseas eliminar la ponderacion?`).subscribe((result) => {
            if (!result || !result.isConfirmed) {
                return;
            }
            this.deleteWeight(ponderacion);
        });
    }

    openWeightRecord(): void {
        this.ponderacionRecord
            .open()
            .afterClosed()
            .subscribe(() => this.getAllWeights(this.filters));
    }

    paginatorChange(event: PageEvent): void {
        this.filters.pageSize = event.pageSize;
        this.filters.pageNumber = event.pageIndex;
        this.getAllWeights(this.filters);
    }

    editWeight(ponderacion: PonderacionDTOV1): void {
        this.ponderacionRecord
            .open({ data: ponderacion })
            .afterClosed()
            .subscribe(() => this.getAllWeights(this.filters));
    }

    getAllWeightExcel(): void {
        this.weight.getAllWeightsExcel(this.filters).subscribe((response) => saveAs(response, 'Ponderacion.xlsx'));
    }

    private deleteWeight(ponderacion: PonderacionDTOV1): void {
        this.weight.deleteWeight(ponderacion.id).subscribe((response) => {
            if (response.exito) {
                Alert.success('', 'Ponderacion eliminada correctamente');
                this.getAllWeights(this.filters);
            } else {
                console.error(response.mensaje);
                Alert.error('', 'No se puede eliminar la Ponderación');
            }
        });
    }

    disableWeights(data: PonderacionDTOV1): void {
        const msg = `Ponderación ${data.activo ? 'inactivado' : 'activado'} correctamente`;
        this.weight.disableWeight(data.id, !data.activo).subscribe((response) => {
            if (response.exito) {
                Alert.success('', msg);
                this.getAllWeights(this.filters);
            } else {
                console.error(response.mensaje);
                Alert.error('', `No se puede ${!data.activo ? 'Deshabilitar' : 'Habilitar'} la Ponderación`);
            }
        });
    }

    private getAllWeights(filters: TablePaginatorSearch): void {
        // console.log();
        this.dataSource.data = [];
        this.data = [];
        this.weight.getAllWeights(filters).subscribe((response) => {
            if (response.output) {
                this.data = response.output.map((ponderacion) => new PonderacionDTOV1().deserialize(ponderacion));
                this.dataSource.data = this.data;
                this.pageIndex = 0;
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
                nivelModalidad: filterValue.trim().toLowerCase(),
            };
            this.paginator.firstPage();
            this.getAllWeights(this.filters);
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
