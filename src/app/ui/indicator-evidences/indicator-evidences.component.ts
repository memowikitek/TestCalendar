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
import { EvidenciasIndicadorDTO } from '../../core/models/evidencias-indicador-dto';
import { ModalEvidenceAdminComponent } from '../../ui/shared-controls/modal-evidence-admin/modal-evidence-admin.component';
import { EvidenciasIndicadorService } from '../../core/services/api/evidencias-indicador/evidencias-indicador.service';
import { MetasIndicadoresDTOV1 } from '../../utils/models/metas-indicadores.dto.v1'; //'src/app/utils/models/metas-indicadores.dto.v1';
@Component({
    selector: 'app-indicator-evidences',
    templateUrl: './indicator-evidences.component.html',
    styleUrls: ['./indicator-evidences.component.scss'],
})
export class IndicatorEvidencesComponent implements OnInit {
    @ViewChild('paginator', { static: true }) readonly paginator: MatPaginator;
    dataSource: MatTableDataSource<EvidenciasIndicadorDTO>;
    permission: boolean;
    filters: TablePaginatorSearch;
    pageIndex: number;
    pageSize: number;
    length: number;
    metasGoal: EvidenciasIndicadorDTO[];
    Listevidencias: EvidenciasIndicadorDTO[];
    Title: string;
    private searchsub$ = new Subject<string>();
    constructor(
        public dialog: MatDialog,
        private readonly route: ActivatedRoute,
        private readonly evidenciaIndicadores: EvidenciasIndicadorService
    ) {
        this.metasGoal = [];
        this.filters = new TablePaginatorSearch();
        this.dataSource = new MatTableDataSource<EvidenciasIndicadorDTO>([]);
    }

    ngOnInit() {
        this.dataSource.paginator = this.paginator;
        this.Title = 'Captura de Evidencias por Indicador';
        this.route.queryParams.subscribe((params) => {
            //   // console.log(params);
            if (params.evidencia && !isNaN(params.evidencia) && params.seccion && !isNaN(params.seccion)) {
                //this.getEvidenceByEvidenceFile(params.evidencia);
            } else {
                //this.router.navigate(['/operacion/vista-libro-electronico']);
            }
        });
        // this.filters = new TablePaginatorSearch();
        this.pageSize = 25;
        this.pageIndex = this.filters.pageNumber;
        this.filters.pageSize = 25;
        this.filters.filter = {};
        this.filters.filter.UserId = Auth.getSession().id;
        this.evidenciasIndicador(this.filters);
        this.searchsub$.pipe(debounceTime(300), distinctUntilChanged()).subscribe((filtervalue: string) => {
            this.filters.filter = {
                PeriodoEvaluacionId: !!Number(filtervalue) ? parseInt(filtervalue) : null,
                ciclo: filtervalue.trim().toLowerCase() != '' ? filtervalue.trim().toLowerCase() : null,
                anio: !!Number(filtervalue) ? parseInt(filtervalue) : null,
                UserId: Auth.getSession().id,
                institucion: filtervalue.trim().toLowerCase() != '' ? filtervalue.trim().toLowerCase() : null,
                //anio: filtervalue.trim().toLowerCase(),
            };
            //debugger;
            this.paginator.firstPage();
            this.evidenciasIndicador(this.filters);
        });
    }
    private evidenciasIndicador(filters: TablePaginatorSearch): void {
        this.dataSource.data = [];
        this.metasGoal = [];
        //this.Listevidencias = [];
        // filters.filter = {};
        filters.filter.UserId = Auth.getSession().id;
        //console.log(filters);
        this.length = 0;
        this.pageSize = 0;
        this.pageIndex = 0;
        this.evidenciaIndicadores.getAllEvideciasIndicador(filters).subscribe((response) => {
            if (response.output) {
                this.metasGoal = response.output.map((evidenciaIndicadores) =>
                    new EvidenciasIndicadorDTO().deserialize(evidenciaIndicadores)
                );
                // console.log(response);
                this.dataSource.data = this.metasGoal;
                this.length = response.paginacion.count;
                // this.pageSize = response.paginacion.registros;
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
        return tipoArea == 'G' ? 'Area Común' : 'Nivel / Modalidad';
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
        const dialogRef = this.dialog.open(ModalEvidenceAdminComponent, {
            maxWidth: '100vw',
            maxHeight: '90vh',
            width: '95vw',
            data: { data: row },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.evidenciasIndicador(this.filters);
            }
        });
    }
    getAllIndicatorMetasExcel(): void {
        this.evidenciaIndicadores
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
