import { SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { ProfileService, UsersService } from 'src/app/core/services';
import { Alert, convertByteArrayToBlob, setDataPaginator } from 'src/app/utils/helpers';
import { Perfil, PerfilDTO, PerfilDTOV1, TablePaginatorSearch, Vista } from 'src/app/utils/models';
import { ProfileRecordService } from './modals';
import { ModulesCatalogDTO } from 'src/app/utils/models/modules-catalog.dto';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { PermisosRolesVistasDTO } from 'src/app/utils/models/permisos-roles-vistas';

@Component({
    selector: 'app-profiles',
    templateUrl: './profiles.component.html',
    styleUrls: ['./profiles.component.scss'],
})
export class ProfilesComponent implements OnInit {
    @ViewChild('input', { static: true }) inputSearch: ElementRef;
    @ViewChild('paginator', { static: true }) readonly paginator: MatPaginator;
    data: PerfilDTOV1[];
    record: PerfilDTOV1;
    dataSource: MatTableDataSource<PerfilDTOV1>;
    selection: SelectionModel<PerfilDTOV1>;
    disabled: boolean;
    filters: TablePaginatorSearch;
    // thisAccess: Vista;
    thisModule: PermisosRolesVistasDTO;
    permisosVistaRol: PermisosRolesVistasDTO;
    // permission: boolean;
    permissions: string[];
    // permisos: string[];
    pageIndex: number;
    pageSize: number;
    length: number;
    

    constructor(
        private router: Router,
        private readonly profileRecord: ProfileRecordService,
        private readonly profile: ProfileService,
        private users: UsersService,
        private access : Vista,
    ) {
        this.data = [];
        this.record = null;
        this.dataSource = new MatTableDataSource<PerfilDTOV1>([]);
        this.dataSource.filterPredicate = function (record: PerfilDTOV1, filter: string): boolean {
            return record.nombre.toLowerCase().includes(filter.toLowerCase());
        };
        this.selection = new SelectionModel<PerfilDTOV1>(true);
        this.disabled = null;
        this.permissions = null;
        this.filters = new TablePaginatorSearch();
        // this.thisAccess = new Vista();
        // this.permissions = [false, false, false];
    }

    ngOnInit(): void {
        this.setPermissions();
        this.pageSize = 25;
        this.pageIndex = this.filters.pageNumber;
        this.filters.pageSize = 25;
        this.filters.filter = {};
        this.getAllProfiles(this.filters);
        fromEvent(this.inputSearch.nativeElement, 'keyup')
            .pipe(
                map((event: any) => event.target.value),
                debounceTime(1000),
                distinctUntilChanged()
            )
            .subscribe((text: string) => {
                this.search(text);
            });
    }

    editProfile(perfil: PerfilDTOV1): void {
        this.profileRecord
            .open({ record: perfil })
            .afterClosed()
            .subscribe(() => this.getAllProfiles(this.filters));
    }

    deleteProfileByConfimation(perfil: PerfilDTOV1): void {
        Alert.confirm('Eliminar Perfil', `¿Deseas eliminar el Perfil?`).subscribe((result) => {
            if (!result || !result.isConfirmed) {
                return;
            }
            this.deleteProfile(perfil);
        });
    }

    disableProfileByConfimation(perfil: PerfilDTOV1): void {
        Alert.confirm(
            'Habilitar/Deshabilidar Perfil',
            `¿Deseas ${perfil.activo ? 'Deshabilitar' : 'Habilitar'} el Perfil?`
        ).subscribe((result) => {
            if (!result || !result.isConfirmed) {
                return;
            }
            this.disableProfile(perfil);
        });
    }

    openProfileRecord(): void {
        this.profileRecord
            .open()
            .afterClosed()
            .subscribe(() => this.getAllProfiles(this.filters));
    }

    paginatorChange(event: PageEvent): void {
        this.filters.pageSize = event.pageSize;
        this.filters.pageNumber = event.pageIndex;
        this.getAllProfiles(this.filters);
    }

    search(term: string): void {
        this.dataSource.filter = term;
        this.filters.pageNumber = 0;
        this.dataSource.paginator = this.paginator;
    }

    getAllProfilesExcel(): void {
        this.profile.getAllProfilesExcel(this.filters).subscribe((response) => saveAs(response, 'Perfiles.xlsx'));
    }

    private deleteProfile(perfil: PerfilDTOV1): void {
        this.profile.deleteProfile(perfil.id).subscribe((response) => {
            if (response.exito) {
                Alert.success('', 'Perfil eliminado correctamente');
                this.paginator.firstPage();
                this.getAllProfiles(this.filters);
            } else {
                console.error(response.mensaje);
                Alert.error('', 'No se puede eliminar el Perfil');
            }
        });
    }

    private disableProfile(perfil: PerfilDTOV1): void {
        const msg = `Perfil ${perfil.activo ? 'inactivado' : 'activado'} correctamente`;
        this.profile.disableProfile(perfil.id, !perfil.activo).subscribe((response) => {
            if (response.exito) {
                Alert.success('', msg);
                this.getAllProfiles(this.filters);
            } else {
                Alert.error('', `No se puede ${!perfil.activo ? 'Deshabilitar' : 'Habilitar'} el Perfil`);
            }
        });
    }

    private getAllProfiles(filters: TablePaginatorSearch): void {
        this.dataSource.data = [];
        this.data = [];
        filters.inactives = true;
        this.pageIndex = 0;
        this.pageSize = 0;
        this.length = 0;
        this.profile.getAllProfiles(filters).subscribe((response) => {
            if (response.output) {
                this.data = response.output.map((perfil) => new PerfilDTOV1().deserialize(perfil));
                this.dataSource.data = this.data;
                this.pageIndex = response.paginacion.pagina;
                this.pageSize = response.paginacion.registros;
                this.length = response.paginacion.count;
            }
        });
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.data.forEach((element: any) => {
            for (const key in element) {
                if (!(typeof element[key] === 'boolean') && !Array.isArray(element[key])) {
                    if (!element[key] || element[key] === null || element[key] == undefined) {
                        element[key] = '';
                    }
                }
            }
        });
        this.paginator.firstPage();
        this.getAllProfiles(this.filters);
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    private setPermissions(): void {
       this.permissions = this.access.getPermissionsV2(this.users.userSession.permisosRolesVistas,this.router.url );

    }

    checkPermission(p: string): boolean {
        return this.permissions?.some(r => r.trim() == p.trim())
    }
}
