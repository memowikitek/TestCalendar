import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AreaResponsableDTOV1, MetasIndicadoresDTO, TablePaginatorSearch } from 'src/app/utils/models';
import { saveAs } from 'file-saver';
import { ModalIndicatorGoalsComponent } from '../../../shared-controls/modal-indicator-goals/modal-indicator-goals.component';
import { MatDialog } from '@angular/material/dialog';
import { IndicatorgoalService } from 'src/app/core/services/api/indicatorgoal/indicatorgoal.service';
import { ActivatedRoute } from '@angular/router';
import { MetasIndicadoresDTOV1 } from 'src/app/utils/models/metas-indicadores.dto.v1';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Alert, AlertConfig, AlertExtendedConfig, Auth } from 'src/app/utils/helpers';

@Component({
    selector: 'app-indicator-goals-capture',
    templateUrl: './indicator-goals-capture.component.html',
    styleUrls: ['./indicator-goals-capture.component.scss'],
})
export class IndicatorGoalsCaptureComponent implements OnInit {
    @ViewChild('paginator', { static: true }) readonly paginator: MatPaginator;
    dataSource: MatTableDataSource<MetasIndicadoresDTOV1>;
    permission: boolean;
    filters: TablePaginatorSearch;
    pageIndex: number;
    pageSize: number;
    length: number;
    metasGoal: MetasIndicadoresDTOV1[];
    isAdmin: boolean;
    areasUsuario: AreaResponsableDTOV1[];
    private searchsub$ = new Subject<string>();
    Title: string;
    constructor(
        public dialog: MatDialog,
        private readonly route: ActivatedRoute,
        private readonly indicatorGoals: IndicatorgoalService
    ) {
        this.metasGoal = [];
        this.Title = 'Captura de Metas por Indicador';
        this.filters = new TablePaginatorSearch();
        this.dataSource = new MatTableDataSource<MetasIndicadoresDTOV1>([]);

        // Validar tipo de Usuario
        this.isAdmin = Auth.getSession().esAdmin;
    }

    ngOnInit() {
        this.dataSource.paginator = this.paginator;
        this.filters = new TablePaginatorSearch();
        this.filters.pageSize = 25;
        this.filters.pageNumber = 0;
        this.filters.filter = {};
        this.filters.filter.UserId = Auth.getSession().id;
        this.getMetasGoald(this.filters);
        this.searchsub$.pipe(debounceTime(300), distinctUntilChanged()).subscribe((filtervalue: string) => {
            if (this.isAdmin) {
                this.filters.filter = {
                    PeriodoEvaluacionId: !!Number(filtervalue) ? parseInt(filtervalue) : null,
                    ciclo: filtervalue.trim().toLowerCase() != '' ? filtervalue.trim().toLowerCase() : null,
                    anio: !!Number(filtervalue) ? parseInt(filtervalue) : null,
                    UserId: Auth.getSession().id,
                    institucion: filtervalue.trim().toLowerCase() != '' ? filtervalue.trim().toLowerCase() : null,
                    areaResponsable: filtervalue.trim().toLowerCase() != '' ? filtervalue.trim().toLowerCase() : null,
                };
            } else {
                this.filters.filter = {
                    PeriodoEvaluacionId: !!Number(filtervalue) ? parseInt(filtervalue) : null,
                    ciclo: filtervalue.trim().toLowerCase() != '' ? filtervalue.trim().toLowerCase() : null,
                    anio: !!Number(filtervalue) ? parseInt(filtervalue) : null,
                    UserId: Auth.getSession().id,
                    institucion: filtervalue.trim().toLowerCase() != '' ? filtervalue.trim().toLowerCase() : null,
                };
            }
            this.filters.pageNumber = 0;
            this.pageIndex = this.filters.pageNumber;
            this.getMetasGoald(this.filters);
        });
    }

    private getMetasGoald(filters: TablePaginatorSearch): void {
        this.metasGoal = [];
        this.dataSource.data = [];
        this.length = 0;
        this.pageSize = 0;
        this.pageIndex = 0;
        this.indicatorGoals.getAllIndicatorsSiac(filters).subscribe((response) => {
            if (response.output) {
                //const data = new MetasIndicadoresDTOV1().deserialize(response);
                this.metasGoal = response.output.map((indicatorGoals) =>
                    new MetasIndicadoresDTOV1().deserialize(indicatorGoals)
                );
                this.dataSource.data = this.metasGoal;
                this.pageIndex = response.paginacion.pagina;
                this.length = response.paginacion.count;
            }
        });
    }
    getAllIndicatorMetasExcel(): void {
        this.indicatorGoals
            .getAllndicatorsMetasExcel(this.filters)
            .subscribe((response) => saveAs(response, 'MetasIdicadores.xlsx'));
    }

    paginatorChange(event: PageEvent): void {
        this.filters.pageSize = event.pageSize;
        this.filters.pageNumber = event.pageIndex;
        this.getMetasGoald(this.filters);
    }
    getCampusList(): string {
        var campus = Auth.getSession().campuses;
        let html = '<ul>';

        if (campus) {
            campus.forEach((item) => {
                html += `<li>${item.clave} - ${item.nombre}</li>`;
            });
            html += '</ul>';
        } else html = '';
        return html;
    }
    getRegionList(): string {
        var region = Auth.getSession().regiones;
        let html = '<ul>';

        if (region) {
            region.forEach((item) => {
                html += `<li>${item.clave} - ${item.nombre}</li>`;
            });
            html += '</ul>';
        } else html = '';
        return html;
    }

    onCapture(row: MetasIndicadoresDTO) {
        const dialogRef = this.dialog.open(ModalIndicatorGoalsComponent, {
            maxWidth: '200vh',
            maxHeight: '90vh',
            data: { data: row },
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.getMetasGoald(this.filters);
            }
        });
    }

    onExport(row: MetasIndicadoresDTOV1) {
        const fileExport = `MI_${String(row.anio).padStart(4, '0')}_${String(row.cicloId).padStart(2, '0')}_${String(
            row.periodoEvaluacionId
        ).padStart(5, '0')}_${String(row.cfgGeneralId).padStart(5, '0')}_${String(row.areaResponsableId).padStart(
            2,
            '0'
        )}.xlsx`;
        this.indicatorGoals
            .getAllndicatorsMetasAdminExcel(
                row.periodoEvaluacionId,
                row.cfgGeneralId,
                row.areaResponsableId,
                row.metasAreaResponsableId,
                Auth.getSession().id
            )
            .subscribe((response) => saveAs(response, fileExport));
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.searchsub$.next(filterValue);
    }
}
