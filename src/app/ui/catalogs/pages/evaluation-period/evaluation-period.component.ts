import { SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { EvaluationPeriodService, UsersService } from 'src/app/core/services';
import { Alert, convertByteArrayToBlob, setDataPaginator } from 'src/app/utils/helpers';
import { PeriodoEvaluacionDTOV1, TablePaginatorSearch, Vista } from 'src/app/utils/models';
import { EvaluationPreiodRecordService } from './modals';
import { ModuleIdV2 } from 'src/app/utils/enums/modules-idV2';
import { ModulesCatalogDTO } from 'src/app/utils/models/modules-catalog.dto';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';

@Component({
    selector: 'app-evaluation-period',
    templateUrl: './evaluation-period.component.html',
    styleUrls: ['./evaluation-period.component.scss'],
})
export class EvaluationPeriodComponent implements OnInit {
    @ViewChild('input', { static: true }) inputSearch: ElementRef;
    @ViewChild('paginator', { static: true }) readonly paginator: MatPaginator;
    data: PeriodoEvaluacionDTOV1[];
    dataSource: MatTableDataSource<PeriodoEvaluacionDTOV1>;
    selection: SelectionModel<PeriodoEvaluacionDTOV1>;
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
        private readonly evaluationPeriod: EvaluationPeriodService,
        private readonly evaluationPeriodRecord: EvaluationPreiodRecordService,
        private users: UsersService
    ) {
        this.data = [];
        this.dataSource = new MatTableDataSource<PeriodoEvaluacionDTOV1>([]);
        this.dataSource.filterPredicate = function (record: PeriodoEvaluacionDTOV1, filter: string): boolean {
            return (
                record.ciclo.toLowerCase().includes(filter.toLowerCase()) ||
                record.id.toString().toLowerCase().includes(filter.toLowerCase()) ||
                record.anio.toString().toLowerCase().includes(filter.toLowerCase()) ||
                record.institucion.toLowerCase().includes(filter.toLowerCase())
            );
        };
        this.selection = new SelectionModel<PeriodoEvaluacionDTOV1>(true);
        this.disabled = null;
        this.permission = null;
        this.filters = new TablePaginatorSearch();
        this.thisAccess = new Vista();
        this.permissions = [false, false, false];
    }

    ngOnInit(): void {
        this.setPermissions();
        this.pageSize = 25;
        this.pageIndex = this.filters.pageNumber;
        this.filters.pageSize = 25;
        this.filters.filter = {};
        this.getAllEvaluationPeriod(this.filters);
    }

    deleteEvaluationPeriodByConfimation(periodoEvaluacion: PeriodoEvaluacionDTOV1): void {
        Alert.confirm('Eliminar Periodo de Evaluación', `¿Deseas eliminar el Periodo de Evaluacion?`).subscribe(
            (result) => {
                if (!result || !result.isConfirmed) {
                    return;
                }
                this.deleteEvaluationPeriod(periodoEvaluacion);
            }
        );
    }

    private deleteEvaluationPeriod(periodoEvaluacion: PeriodoEvaluacionDTOV1): void {
        this.evaluationPeriod.deletePeriodEvaluation(periodoEvaluacion.id.toString()).subscribe((response) => {
            if (response.exito) {
                //  this.filters.pageNumber = 1;
                this.paginator.firstPage();
                this.getAllEvaluationPeriod(this.filters);
                Alert.success('', 'Periodo de evaluación eliminado correctamente');
            } else {
                console.error(response.mensaje);
                Alert.error('', 'No se puede eliminar el Periodo');
            }
        });
    }

    openEvaluationPeriodRecord(): void {
        this.evaluationPeriodRecord
            .open()
            .afterClosed()
            .subscribe(() => this.getAllEvaluationPeriod(this.filters));
    }

    editEvaluationPeriod(periodoEvaluacion: PeriodoEvaluacionDTOV1): void {
        this.evaluationPeriodRecord
            .open({ data: periodoEvaluacion })
            .afterClosed()
            .subscribe(() => this.getAllEvaluationPeriod(this.filters));
    }

    search(term: string): void {
        this.dataSource.filter = term;
        this.filters.pageNumber = 0;
        this.dataSource.paginator = this.paginator;
    }

    paginatorChange(event: PageEvent): void {
        this.filters.pageSize = event.pageSize;
        this.filters.pageNumber = event.pageIndex;
        this.getAllEvaluationPeriod(this.filters);
        //this.dataSource.paginator = this.paginator;
    }

    private getAllEvaluationPeriod(filters: TablePaginatorSearch): void {
        this.dataSource.data = [];
        this.data = [];
        filters.inactives = true;
        this.evaluationPeriod.getAllPeriodEvaluation(filters).subscribe((response) => {
            if (response.output) {
                this.data = response.output.map((periodoEvaluacion) =>
                    new PeriodoEvaluacionDTOV1().deserialize(periodoEvaluacion)
                );
                this.dataSource.data = this.data;
                //this.dataSource.paginator = this.paginator;
                this.pageIndex = response.paginacion.pagina;
                this.pageSize = response.paginacion.registros;
                this.length = response.paginacion.count;
            }
        });
    }

    getAllEvaluationPeriodExcel(): void {
        this.evaluationPeriod
            .getUrlAllPeriodEvaluationExcel()
            .subscribe((response) => saveAs(response, 'DetallesPeriodoDeEvaluación.xlsx'));
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;

        const filterValueInteger = isNaN(parseInt(filterValue.trim())) ? null : parseInt(filterValue.trim());

        if (filterValue.length > 2 || filterValue.length == 0) {
            this.filters.filter = {
                //id: filterValue.trim().toLowerCase(),
                anio: filterValueInteger,
                ciclo: filterValue.trim().toLowerCase(),
                institucion: filterValue.trim().toLowerCase(),
            };
            this.filters.pageNumber = 0;
            this.pageIndex = this.filters.pageNumber;
            this.getAllEvaluationPeriod(this.filters);
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
