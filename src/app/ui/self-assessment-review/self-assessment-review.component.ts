import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import {
    CampusService,
    CyclesService,
    LevelModalityService,
    RegionsService,
    ResponsibilityAreasService,
} from 'src/app/core/services';
import { YearHelp } from 'src/app/utils/helpers';
import {
    Anio,
    AreaResponsableDTO,
    AreaResponsableDTOV1,
    CampusDTO,
    CampusDTOV1,
    Ciclo,
    MetaResultadosDTO,
    NivelModalidadDTO,
    NivelModalidadDTOV1,
    RegionDTO,
    RegionDTOV1,
    TablePaginatorSearch,
} from 'src/app/utils/models';
import { SelfAssessmentReviewRecordService } from './modals';

@Component({
    selector: 'app-self-assessment-review',
    templateUrl: './self-assessment-review.component.html',
    styleUrls: ['./self-assessment-review.component.scss'],
})
export class SelfAssessmentReviewComponent implements OnInit {
    yearList: Anio[];
    cycleList: Ciclo[];
    regionsList: RegionDTOV1[];
    levelModalityList: NivelModalidadDTOV1[];
    campusList: CampusDTOV1[];
    responsibilityAreasList: AreaResponsableDTOV1[];
    data: MetaResultadosDTO[];
    dataSource: MatTableDataSource<MetaResultadosDTO>;
    selection: SelectionModel<MetaResultadosDTO>;
    disabled: boolean;
    permission: boolean;
    filters: TablePaginatorSearch;
    constructor(
        private readonly cycles: CyclesService,
        private readonly levelModality: LevelModalityService,
        private readonly campus: CampusService,
        private readonly regions: RegionsService,
        private readonly selfAssessmentReviewRecordService: SelfAssessmentReviewRecordService,
        private readonly responsibilityAreas: ResponsibilityAreasService
    ) {
        this.data = [];
        this.yearList = [];
        this.cycleList = [];
        this.regionsList = [];
        this.levelModalityList = [];
        this.campusList = [];
        this.responsibilityAreasList = [];
        this.dataSource = new MatTableDataSource<MetaResultadosDTO>([]);
        this.selection = new SelectionModel<MetaResultadosDTO>(true);
        this.disabled = null;
        this.permission = null;
        this.filters = new TablePaginatorSearch();
    }
    ngOnInit(): void {
        this.yearList = YearHelp.getListAnio();
        this.getAllCampus();
        this.getAllCycles();
        this.getAllLevelModality();
        this.getAllResponsibilityAreas();
        this.getAllRegions();
        this.openselfAssessmentReviewRecordService();
    }
    paginatorChange(event: PageEvent): void {
        this.filters.pageSize = event.pageSize;
        this.filters.pageNumber = event.pageIndex;
        //this.getAllCampus(this.filters);
    }

    openselfAssessmentReviewRecordService(): void {
        this.selfAssessmentReviewRecordService.open().afterClosed();
        //  .subscribe(() => this.getAllCampus(this.filters));
    }

    private getAllCampus(): void {
        //todo j031 240403, ajustar por cambio de apppResult
        const filters = new TablePaginatorSearch();
        filters.inactives = true;
        const nombre ="";
        this.campus.getAllCampus(filters).subscribe((response) => {
            if (response.data) {
                this.campusList = response.data.map((campus) => new CampusDTOV1().deserialize(campus));
            }
        });
    }

    private getAllCycles(): void {
        const filters = new TablePaginatorSearch();
        this.cycles.getAllCycles(filters).subscribe((response) => {
            if (response.data.data) {
                this.cycleList = response.data.data.map((ciclo) => new Ciclo().deserialize(ciclo));
            }
        });
    }
    private getAllLevelModality(): void {
        const filters = new TablePaginatorSearch();
        this.levelModality.getAllLevelModality(filters).subscribe((response) => {
            if (response.output) {
                this.levelModalityList = response.output.map((nivelModalidad) =>
                    new NivelModalidadDTOV1().deserialize(nivelModalidad)
                );
            }
        });
    }

    private getAllRegions(): void {
        const filters = new TablePaginatorSearch();
        this.regions.getAllRegions(filters).subscribe((response) => {
            if (response.output) {
                this.regionsList = response.output.map((region) => new RegionDTOV1().deserialize(region));
            }
        });
    }

    private getAllResponsibilityAreas(): void {
        const filters = new TablePaginatorSearch();
        this.responsibilityAreas.getAllResponsibilityAreas(filters).subscribe((response) => {
            if (response.output) {
                this.responsibilityAreasList = response.output.map((areaResponsable) =>
                    new AreaResponsableDTOV1().deserialize(areaResponsable)
                );
            }
        });
    }
}
