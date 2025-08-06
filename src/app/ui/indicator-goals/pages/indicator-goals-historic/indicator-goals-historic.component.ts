import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TablePaginatorSearch } from 'src/app/utils/models';
import { ModalIndicatorGoalsComponent } from '../../../shared-controls/modal-indicator-goals/modal-indicator-goals.component';
import { MatDialog } from '@angular/material/dialog';
import { IndicatorgoalService } from 'src/app/core/services/api/indicatorgoal/indicatorgoal.service';
import { ActivatedRoute } from '@angular/router';
import { MetasIndicadoresDTOV1 } from 'src/app/utils/models/metas-indicadores.dto.v1';

@Component({
    selector: 'app-indicator-goals-historic',
    templateUrl: './indicator-goals-historic.component.html',
    styleUrls: ['./indicator-goals-historic.component.scss'],
})
export class IndicatorGoalsHistoricComponent implements OnInit {
    @ViewChild('paginator', { static: true }) readonly paginator: MatPaginator;
    dataSource: MatTableDataSource<MetasIndicadoresDTOV1>;
    permission: boolean;
    filters: TablePaginatorSearch;
    pageIndex: number;
    pageSize: number;
    length: number;
    metasGoal: MetasIndicadoresDTOV1[];
    constructor(
        public dialog: MatDialog,
        private readonly route: ActivatedRoute,
        private readonly indicatorGoals: IndicatorgoalService
    ) {
        this.metasGoal = [];
        this.dataSource = new MatTableDataSource<MetasIndicadoresDTOV1>([]);
    }

    ngOnInit() {
        this.dataSource.paginator = this.paginator;
        this.route.queryParams.subscribe((params) => {
            //   // console.log(params);
            if (params.evidencia && !isNaN(params.evidencia) && params.seccion && !isNaN(params.seccion)) {
                //this.getEvidenceByEvidenceFile(params.evidencia);
            } else {
                //this.router.navigate(['/operacion/vista-libro-electronico']);
            }
        });
        this.filters = new TablePaginatorSearch();
        this.filters.pageSize = 5;
        this.filters.pageNumber = 0;
        this.filters.filter = {};
        this.getMetasGoald(this.filters);
    }

    private getMetasGoald(filters: TablePaginatorSearch): void {
        this.metasGoal = [];
        this.dataSource.data = [];
        this.indicatorGoals.getAllIndicatorsSiac(filters).subscribe((response) => {
            if (response.output) {
                const data = new MetasIndicadoresDTOV1().deserialize(response);
                this.metasGoal = response.output.map((indicatorGoals) =>
                    new MetasIndicadoresDTOV1().deserialize(indicatorGoals)
                );
                this.dataSource.data = this.metasGoal;
                this.pageIndex = response.paginacion.pagina;
                this.pageSize = response.paginacion.registros;
                this.length = response.paginacion.count;
            }
        });
    }

    paginatorChange(event: PageEvent): void {}

    getTypeArea(tipoArea: string): string {
        return tipoArea == 'G' ? 'Nivel / Modalidad' : 'Area Común';
    }

    onCapture(row: any) {
        const dialogRef = this.dialog.open(ModalIndicatorGoalsComponent, {
            width: '150vh',
            height: '75vh',
            data: { data: row },
        });

        dialogRef.afterClosed().subscribe((result) => {
            // // console.log(result);
        });
    }
}
