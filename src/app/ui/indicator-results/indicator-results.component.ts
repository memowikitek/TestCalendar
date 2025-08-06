import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Alert, Auth } from 'src/app/utils/helpers';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { saveAs } from 'file-saver';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

import { TablePaginatorSearch, MetasIndicadoresDTO } from '../../utils/models';
import { ResultadosIndicadorDTO } from 'src/app/core/models/resultados-indicador-dto';
import { ModalEvidenceAdminComponent } from '../shared-controls/modal-evidence-admin/modal-evidence-admin.component';
import { ResultadosIndicadorService } from 'src/app/core/services/api/resultados-indicador/resultados-indicador.service';
import { ModalIndicatorResultsComponent } from '../shared-controls/modal-indicator-results/modal-indicator-results.component';

@Component({
    selector: 'app-indicator-results',
    templateUrl: './indicator-results.component.html',
    styleUrls: ['./indicator-results.component.scss'],
})
export class IndicatorResultsComponent implements OnInit { 
    
    @ViewChild('paginator', { static: true }) readonly paginator: MatPaginator;
    dataSource: MatTableDataSource<ResultadosIndicadorDTO>;
    permission: boolean;
    filters: TablePaginatorSearch;
    pageIndex: number;
    pageSize: number;
    length: number;
    metasGoal: ResultadosIndicadorDTO[];
    Listevidencias: ResultadosIndicadorDTO[];
    Title: string;
    private searchsub$ = new Subject<string>();

    constructor( public dialog: MatDialog,
        private readonly route: ActivatedRoute,
        private readonly resultadosIndicadorService: ResultadosIndicadorService)
        {
            this.Title = 'Captura de Resultados por Indicador';
            this.metasGoal = [];
            this.filters = new TablePaginatorSearch();
            this.dataSource = new MatTableDataSource<ResultadosIndicadorDTO>([]);
        }

    ngOnInit() {
        this.dataSource.paginator = this.paginator;
        this.filters = new TablePaginatorSearch();
        this.pageSize = 25;
        this.pageIndex = this.filters.pageNumber;
        this.filters.pageSize = 25;
        this.filters.filter = {};
        this.filters.filter.UserId = Auth.getSession().id;
        this.evidenciasIndicador(this.filters);
        this.searchsub$.pipe(debounceTime(300), distinctUntilChanged()).subscribe((filtervalue: string) => {
            this.filters.filter = {
                Idproceso: !!Number(filtervalue) ? parseInt(filtervalue) : null,
                ciclo: filtervalue.trim().toLowerCase() != '' ? filtervalue.trim().toLowerCase() : null,
                anio: !!Number(filtervalue) ? parseInt(filtervalue) : null,
                UserId: Auth.getSession().id,
                institucion: filtervalue.trim().toLowerCase() != '' ? filtervalue.trim().toLowerCase() : null,
                //anio: filtervalue.trim().toLowerCase(),
            };
            this.paginator.firstPage();
            this.evidenciasIndicador(this.filters);
        });
    }
    private evidenciasIndicador(filters: TablePaginatorSearch): void {
        this.dataSource.data = [];
        this.metasGoal = [];
        this.resultadosIndicadorService.getAllResultadosIndicador(filters).subscribe((response) => {
            if (response.output) {
                this.metasGoal = response.output.map((resultadosIndicadorService) =>
                    new ResultadosIndicadorDTO().deserialize(resultadosIndicadorService)
                );
                this.dataSource.data = this.metasGoal;
                this.length = response.paginacion.count;
                this.pageSize = response.paginacion.registros;
                this.pageIndex = response.paginacion.pagina;
            }
        });
    }
    paginatorChange(event: PageEvent): void {
        this.filters.pageSize = event.pageSize;
        this.filters.pageNumber = event.pageIndex;
        this.evidenciasIndicador(this.filters);
    }
    getTypeArea(tipoArea: string): string {
        return tipoArea == 'G' ?  'Area Común' : 'Nivel / Modalidad';
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
        // console.log();
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
        // console.log();
        return html;
    }
    onCapture(row: any) {
        const dialogRef = this.dialog.open(ModalIndicatorResultsComponent, {
            maxWidth: '300vh',
            maxHeight: '90vh',
            data: { data: row },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result){
                this.evidenciasIndicador(this.filters);
            }
        });
    }
    getAllIndicatorMetasExcel(): void {
        this.resultadosIndicadorService
            .getAllndicatorsMetasExcel(this.filters)
            .subscribe((response) => saveAs(response, 'Evidenciasdicadores.xlsx'));
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
}
