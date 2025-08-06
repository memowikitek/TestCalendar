import { SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { ResponsibilityAreasService, UsersService } from 'src/app/core/services';
import { Alert, convertByteArrayToBlob, setDataPaginator } from 'src/app/utils/helpers';
import { AreaResponsableDTO, AreaResponsableDTOV1, TablePaginatorSearch, Vista } from 'src/app/utils/models';
import { ResponsibilityAreasRecordService } from './modals/responsibility-areas-record/responsibility-areas-record.service';
import { Router } from '@angular/router';
import { ModulesCatalogDTO } from 'src/app/utils/models/modules-catalog.dto';
import { saveAs } from 'file-saver';
import { Subject } from 'rxjs';
import { ConfigurationsModule } from 'src/app/ui/configurations/configurations.module';
import { AreaResponsableCampusDTO } from '../../../../utils/models/area-responsable-campus.dto';
import { BasicNotification } from '../../../../utils/helpers/basicNotification';

@Component({
    selector: 'app-responsibility-areas',
    templateUrl: './responsibility-areas.component.html',
    styleUrls: ['./responsibility-areas.component.scss'],
})
export class ResponsibilityAreasComponent implements OnInit {
    @ViewChild('input', { static: true }) inputSearch: ElementRef;
    data: AreaResponsableCampusDTO[];
    selection: SelectionModel<AreaResponsableDTOV1>;
    filters: TablePaginatorSearch;
    pageIndex: number;
    pageSize: number;
    length: number;
    disabled: boolean;
    thisAccess: Vista;
    thisModule: ModulesCatalogDTO;
    permissions: string[];
    private searchsub$ = new Subject<string>();

    constructor(
        private router: Router,
        private readonly responsibilityAreasRecord: ResponsibilityAreasRecordService,
        private readonly responsibilityAreas: ResponsibilityAreasService,
        private users: UsersService,
        private basicNotification: BasicNotification,
        private access : Vista,
    ) {
        this.data = [];
        this.filters = new TablePaginatorSearch();
        this.selection = new SelectionModel<AreaResponsableDTOV1>(true);
        this.permissions = [];
    }

    ngOnInit(): void {
        this.setPermissions();
        this.pageSize = 25;
        this.pageIndex = this.filters.pageNumber;
        this.filters.pageSize = 25;
        this.filters.filter = {};
        this.getAllResponsibilityAreasCampus(this.filters);

        this.searchsub$.pipe(debounceTime(300), distinctUntilChanged()).subscribe((filtervalue: string) => {
            if (filtervalue.trim().toLowerCase() != '') {
                this.filters.filter = {
                    searchTerm: filtervalue.trim().toLowerCase(),
                };
            } else {
                this.filters.filter = {};
            }
            this.filters.pageNumber = 0;
            this.pageIndex = this.filters.pageNumber;
            this.getAllResponsibilityAreasCampus(this.filters);
        });
    }

    paginatorChange(event: PageEvent): void {
        this.filters.pageSize = event.pageSize;
        this.filters.pageNumber = event.pageIndex;
        this.getAllResponsibilityAreasCampus(this.filters);
    }

    openResponsibilityAreas(): void {
        this.responsibilityAreasRecord
            .open()
            .afterClosed()
            .subscribe((response) => {
                if (response) {
                    this.getAllResponsibilityAreasCampus(this.filters);
                }
            });
    }

    editResponsibilityArea(areaResponsable: AreaResponsableDTOV1): void {
        this.responsibilityAreasRecord
            .open({ data: areaResponsable })
            .afterClosed()
            .subscribe(() => this.getAllResponsibilityAreasCampus(this.filters));
    }

    disableResponsibilityArea(data: AreaResponsableDTOV1): void {
        const msg = `Área Responsable ${data.activo ? 'inactivada' : 'activada'} correctamente`;
        this.responsibilityAreas.disableResponsibilityArea(data.id, !data.activo).subscribe((response) => {
            if (response.exito) {
                // Alert.success('', msg);
                this.basicNotification.notif('success', msg);
                this.getAllResponsibilityAreasCampus(this.filters);
            } else {
                console.error(response.mensaje);
                Alert.error('', `No se puede ${!data.activo ? 'activar' : 'inactivar'} el Área Responsable`);
            }
        });
    }

    deleteAreaResponsibility(data: AreaResponsableDTOV1): void {
        Alert.confirm('Eliminar área responsable', '¿Deseas eliminar esta área responsable?').subscribe((result) => {
            if (!result || !result.isConfirmed) {
                return;
            }
            this.responsibilityAreas.deleteResponsibilityArea(data.id).subscribe((response) => {
                if (response.exito) {
                    //Alert.success('', 'Área eliminada correctamente');
                    this.basicNotification.notif('success', 'Área eliminada correctamente');
                    this.getAllResponsibilityAreasCampus(new TablePaginatorSearch());
                } else {
                    console.error(response.mensaje);
                    Alert.error('', 'No se puede eliminar el Área');
                }
            });
        });
    }

    getAllResponsabilitiesExcel(): void {
        this.responsibilityAreas
            .getAllResponsibilityAreasExcel(this.filters)
            .subscribe((response) => saveAs(response, 'AreasResponsables.xlsx'));
    }

    getAllResponsibilityAreasCampus(filters: TablePaginatorSearch): void {
        this.length = 0;
        this.pageSize = 0;
        this.pageIndex = 0;
        this.responsibilityAreas.getAllResponsibilityAreasCampus(filters).subscribe((response) => {
            if (response.data) {
                //const data = response.data.map((area) => new AreaResponsableCampusDTO().deserialize(area));
                this.data = response.data;
                this.pageIndex = response.paginationResult.pageNumber;
                this.pageSize = response.paginationResult.pageSize;
                this.length = response.paginationResult.totalRecords;
            }
        });
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.searchsub$.next(filterValue);
    }

    private setPermissions(): void {
        this.permissions = this.access.getPermissionsV2(this.users.userSession.permisosRolesVistas,this.router.url );
      
      }
      
      checkPermission(p: string): boolean {
        return this.permissions?.some(r => r.trim() == p.trim())
      }
}
