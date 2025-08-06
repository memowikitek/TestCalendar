import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import {
    ComponenteMIDTOV1,
    MatrizMIDTOV1,
    MatrizMIDTOV2,
    PilarEstrategicoMIDTOV1,
    TablePaginatorSearch,
    Vista,
} from 'src/app/utils/models';
import { Alert, convertByteArrayToBlob, setDataPaginator } from 'src/app/utils/helpers';
import { MatrixMiService, UsersService } from 'src/app/core/services';
import { MatrixMiRecordService } from './modals';
import { ModulesCatalogDTO } from 'src/app/utils/models/modules-catalog.dto';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';

@Component({
    selector: 'app-matrix-mi',
    templateUrl: './matrix-mi.component.html',
    styleUrls: ['./matrix-mi.component.scss'],
})
export class MatrixMiComponent implements OnInit {
    @ViewChild('input', { static: true }) inputSearch: ElementRef;
    @ViewChild('paginator', { static: true }) readonly paginator: MatPaginator;
    dataSource: MatTableDataSource<MatrizMIDTOV2>;
    disabled: boolean;
    permission: boolean;
    filters: TablePaginatorSearch;
    pageIndex: number;
    pageSize: number;
    length: number;
    data: MatrizMIDTOV2[];
    thisAccess: Vista;
    thisModule: ModulesCatalogDTO;
    permissions: boolean[];

    constructor(
        private router: Router,
        private readonly MatrixMiRecordService: MatrixMiRecordService,
        private readonly MatrixMiService: MatrixMiService,
        private users: UsersService
    ) {
        this.dataSource = new MatTableDataSource<MatrizMIDTOV2>([]);
        this.data = [];
        this.disabled = null;
        this.permission = null;
        this.filters = new TablePaginatorSearch();
        this.thisAccess = new Vista();
        this.permissions = [false, false, false];
    }

    ngOnInit(): void {
        //todo: revisar seguridad
        // this.setPermissions();
        this.disabled = !this.checkPermission(2);
        this.pageSize = 25;
        this.pageIndex = this.filters.pageNumber;
        this.filters.pageSize = 25;
        this.filters.filter = {};
        this.getAllMatrixMi(this.filters);
    }

    paginatorChange(event: PageEvent): void {
        this.filters.pageSize = event.pageSize;
        this.filters.pageNumber = event.pageIndex;
        this.getAllMatrixMi(this.filters);
    }

    editMatrixMiRecord(MatrizMi: MatrizMIDTOV1): void {
        this.MatrixMiRecordService.open({ data: MatrizMi })
            .afterClosed()
            .subscribe(() => this.getAllMatrixMi(this.filters));
    }

    openMtrixMiRecordServiceRecord(): void {
        this.MatrixMiRecordService.open()
            .afterClosed()
            .subscribe(() => {
                this.getAllMatrixMi(this.filters);
            });
    }

    deleteMatrixMiByConfimation(MatrizMi: MatrizMIDTOV2): void {
        Alert.confirm('Eliminar Matriz MI', `¿Deseas eliminar la mtriz?`).subscribe((result) => {
            if (!result || !result.isConfirmed) {
                return;
            }
            this.deleteMatrixMi(MatrizMi);
        });
    }

    getAllMatrixMiExcel(): void {
        this.MatrixMiService.getAllMatrizMiExcel(this.filters).subscribe((response) =>
            saveAs(response, 'MatrizMI.xlsx')
        );
    }

    private getAllMatrixMi(filters: TablePaginatorSearch): void {
        this.dataSource.data = [];
        this.data = [];
        this.MatrixMiService.getAllMatrizMi(filters).subscribe((response) => {
            if (response.output) {
                this.data = response.output.map((item) => new MatrizMIDTOV2().deserialize(item));
                this.dataSource.data = this.data;
                this.pageIndex = response.paginacion.pagina;
                this.pageSize = response.paginacion.registros;
                this.length = response.paginacion.count;
            }
        });
    }

    private deleteMatrixMi(MatrizMi: MatrizMIDTOV2): void {
        this.MatrixMiService.deleteMatrizMi(MatrizMi.matrizMiid).subscribe(() => {
            this.paginator.firstPage();
            this.getAllMatrixMi(this.filters);
            Alert.success('', 'Matriz MI eliminado correctamente');
        });
    }

    getPilarEstrategicoMiListString(componenteMi: ComponenteMIDTOV1): string {
        // console.log(componenteMi);
        return '';
    }

    private setPermissions(): void {
        this.permissions = this.thisAccess.getPermissions(
            this.users.userSession.modulos,
            this.users.userSession.vistas,
            this.router.url
        );
    }

    checkPermission(p: number): boolean {
        //todo: revisar seguridad
        return true;
        return this.permissions[p];
    }
}
