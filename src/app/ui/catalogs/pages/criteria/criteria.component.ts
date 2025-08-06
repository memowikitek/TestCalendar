import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AccreditorsService, ChapterService, CriteriaService, UsersService } from 'src/app/core/services';
import { Alert, setDataPaginator } from 'src/app/utils/helpers';
import {
    AcreditadoraDTOV1,
    AcreditadoraProcesoDTOV1,
    CarreraDTOV1,
    CriterioDTOV1,
    FiltersModal,
    TablePaginatorSearch,
    Vista,
} from 'src/app/utils/models';
import { CriteriaRecordService } from './modals/criteria-record/criteria-record.service';
import { ModulesCatalogDTO } from 'src/app/utils/models/modules-catalog.dto';
import { Router } from '@angular/router';
import { MatSelectChange } from '@angular/material/select';

@Component({
    selector: 'app-criteria',
    templateUrl: './criteria.component.html',
    styleUrls: ['./criteria.component.scss'],
})
export class CriteriaComponent implements OnInit {
    @ViewChild('input', { static: true }) inputSearch: ElementRef;
    @ViewChild('paginator', { static: true }) readonly paginator: MatPaginator;

    dataSource: MatTableDataSource<CriterioDTOV1>;
    filters: TablePaginatorSearch;
    pageIndex: number;
    pageSize: number;
    length: number;
    thisAccess: Vista;
    thisModule: ModulesCatalogDTO;
    permissions: boolean[];
    disabled: boolean;
    data: CriterioDTOV1[];

    criteriaForm: FormGroup;

    accreditorList: AcreditadoraDTOV1[];
    processList: AcreditadoraProcesoDTOV1[];
    careersList: CarreraDTOV1[];
    descripcion: string;

    constructor(
        private router: Router,
        private users: UsersService,
        private readonly formBuilder: FormBuilder,
        private readonly criteriaRecord: CriteriaRecordService,
        private readonly accreditors: AccreditorsService,
        private readonly criteria: CriteriaService,
        private readonly chapter: ChapterService // private readonly copyResultModal: CopyResultModalService
    ) {
        this.criteriaForm = this.formBuilder.group({
            accreditation: [null, [Validators.required]],
            process: [null, [Validators.required]],
            career: [null, [Validators.required]],
        });
        this.filters = new TablePaginatorSearch();
        this.dataSource = new MatTableDataSource<CriterioDTOV1>([]);
        this.accreditorList = [];
        this.processList = [];
        this.careersList = [];
        this.descripcion = null;

        this.dataSource.filterPredicate = function (record: CriterioDTOV1, filter: string): boolean {
            return record.descripcion.toLowerCase().includes(filter.toLowerCase());
        };
        this.data = [];
        this.filters = new TablePaginatorSearch();
        this.thisAccess = new Vista();
        this.permissions = [false, false, false];
    }

    ngOnInit() {
        this.setPermissions();
        this.disabled = !this.checkPermission(0);
        this.pageSize = 25;
        this.pageIndex = this.filters.pageNumber;
        this.filters.pageSize = 25;
        this.filters.filter = {};
        this.getAllAccreditors();
        this.getAllCareers();
    }

    paginatorChange(event: PageEvent): void {
        this.filters.pageSize = event.pageSize;
        this.filters.pageNumber = event.pageIndex;
        this.getAllCriteria(this.filters);
    }

    private getAllCriteria(filter: TablePaginatorSearch) {
        this.dataSource.data = [];
        this.data = [];
        this.criteria.getAllCriteria(filter).subscribe((response) => {
            if (response.output) {
                this.data = response.output.map((criteria) => new CriterioDTOV1().deserialize(criteria));
                this.dataSource.data = this.data;
                this.pageIndex = response.paginacion.pagina;
                this.pageSize = response.paginacion.registros;
                this.length = response.paginacion.count;
            }
        });
    }

    getAllAccreditors() {
        this.accreditorList = [];
        const filters = new TablePaginatorSearch();
        filters.pageSize = 999999;
        filters.pageNumber = 0;
        this.criteriaForm.get('process').disable();
        this.accreditors.getAllAccreditors(filters).subscribe((response) => {
            if (response.output) {
                this.accreditorList = response.output.map((item) => new AcreditadoraDTOV1().deserialize(item));
            }
        });
    }

    onChangeAcreditation(event: MatSelectChange): void {
        this.criteriaForm.get('process').enable();
        this.criteriaForm.get('process').patchValue(null);
        this.processList = [];
        const filters = new TablePaginatorSearch();
        filters.pageSize = 999999;
        filters.pageNumber = 0;
        filters.filter = { acreditadoraId: event.value };
        this.changeFilter();
        this.accreditors.getAllAccreditorsProccess(filters).subscribe((response) => {
            if (response.output) {
                this.processList = response.output.map((item) => new AcreditadoraProcesoDTOV1().deserialize(item));
            }
        });
    }

    getAllCareers() {
        this.careersList = [];
        const filters = new TablePaginatorSearch();
        filters.pageSize = 999999;
        filters.pageNumber = 0;
        this.criteria.getCareerList(filters).subscribe((response) => {
            if (response.output) {
                this.careersList = response.output.map((item) => new CarreraDTOV1().deserialize(item));
            }
        });
    }

    async changeFilter(): Promise<void> {
        this.filters.filter = {};
        const processId = this.criteriaForm.get('process').value;
        const careerId = this.criteriaForm.get('career').value;
        this.filters.filter = {
            descripcion: this.descripcion,
            acreditadoraProcesoId: processId,
            carreraId: careerId,
        };
        if (this.criteriaForm.valid) {
            this.paginator.firstPage();
            this.getAllCriteria(this.filters);
        }
    }

    openRecord(element?: CriterioDTOV1): void {
        const form = this.criteriaForm.value;
        const filters = new FiltersModal();
        filters.acreditadoraProcesoId = form.process;
        filters.carreraId = form.career;
        filters.processId = form.process;
        const data = {
            data: element ? element : null,
            filters,
        };

        this.criteriaRecord
            .open(data)
            .afterClosed()
            .subscribe((response) => {
                if (response) {
                    this.getAllCriteria(this.filters);
                }
            });
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.descripcion = null;
        if (filterValue.length > 2 || filterValue.length == 0) {
            this.descripcion = filterValue.trim().toLowerCase();
            this.changeFilter();
            // this.paginator.firstPage();
            // this.getAllCriteria(this.filters);
            //this.dataSource.filter = filterValue.trim().toLowerCase();
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
