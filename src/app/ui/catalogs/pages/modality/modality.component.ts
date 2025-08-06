import { SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { UsersService } from 'src/app/core/services';
import { Alert, convertByteArrayToBlob, setDataPaginator } from 'src/app/utils/helpers';
import { ModalidadDTOV1, TablePaginatorSearch, Vista } from 'src/app/utils/models';
import { ModalityRecordService } from './modals';
import { ModuleIdV2 } from 'src/app/utils/enums/modules-idV2';
import { ModalityService } from 'src/app/core/services/api/modality/modality.service';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';

@Component({
    selector: 'app-modality',
    templateUrl: './modality.component.html',
    styleUrls: ['./modality.component.scss'],
    standalone: false
})
export class ModalityComponent implements OnInit {
    @ViewChild('input', { static: true }) inputSearch: ElementRef;
    @ViewChild('paginator', { static: true }) readonly paginator: MatPaginator;
    data: ModalidadDTOV1[];
    dataSource: MatTableDataSource<ModalidadDTOV1>;
    selection: SelectionModel<ModalidadDTOV1>;
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
        private readonly ModalityRecord: ModalityRecordService,
        private readonly Modality: ModalityService,
        private users: UsersService
    ) {
        this.data = [];
        this.dataSource = new MatTableDataSource<ModalidadDTOV1>([]);
        this.dataSource.filterPredicate = function (record: ModalidadDTOV1, filter: string): boolean {
            return record.nombre.toLowerCase().includes(filter.toLowerCase());
        };
        this.selection = new SelectionModel<ModalidadDTOV1>(true);
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
        this.getAllModality(this.filters);
    }

    editModality(Modality: ModalidadDTOV1): void {
        this.ModalityRecord.open({ data: Modality })
            .afterClosed()
            .subscribe(() => this.getAllModality(this.filters));
    }

    disableModality(data: ModalidadDTOV1): void {
        const msg = `Modalidad ${data.activo ? 'inactivado' : 'activado'} correctamente`;
        this.Modality.disableModality(data.id, !data.activo).subscribe((response) => {
            if (response.exito) {
                Alert.success('', msg);
                this.getAllModality(this.filters);
            } else {
                console.error(response.mensaje);
                Alert.error('', `No se puede ${!data.activo ? 'Deshabilitar' : 'Habilitar'} la Modalidad`);
            }
        });
    }

    deleteModalityByConfimation(Modality: ModalidadDTOV1): void {
        Alert.confirm('Eliminar Modalidad', `¿Deseas eliminar la Modalidad?`).subscribe((result) => {
            if (!result || !result.isConfirmed) {
                return;
            }
            this.deleteModality(Modality);
        });
    }

    openModalityRecord(): void {
        this.ModalityRecord.open()
            .afterClosed()
            .subscribe(() => this.getAllModality(this.filters));
    }

    paginatorChange(event: PageEvent): void {
        this.filters.pageSize = event.pageSize;
        this.filters.pageNumber = event.pageIndex;
        this.getAllModality(this.filters);
    }

    getAllModalityExcel(): void {
        this.Modality.getAllModalityExcel(this.filters).subscribe((response) => saveAs(response, 'Modalidad.xlsx'));
    }

    private deleteModality(Modality: ModalidadDTOV1): void {
        this.Modality.deleteModality(Modality.id).subscribe(() => {
            this.paginator.firstPage();
            this.getAllModality(this.filters);
            Alert.success('', 'Modalidad eliminada correctamente');
        });
    }

    private getAllModality(filters: TablePaginatorSearch): void {
        this.dataSource.data = [];
        this.data = [];
        filters.inactives = true;
        this.Modality.getAllModality(filters).subscribe((response) => {
            if (response.output) {
                this.data = response.output.map((modality) => new ModalidadDTOV1().deserialize(modality));
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
            this.getAllModality(this.filters);
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
