import { SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { fromEvent } from 'rxjs';
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { UsersService } from 'src/app/core/services';
import { Alert, convertByteArrayToBlob, setDataPaginator } from 'src/app/utils/helpers';
import {
    AreaResponsableDTOV1,
    CampusDTOV1,
    CatalogoUsuarioDTO,
    CatalogoUsuarioDTOV1,
    RegionDTOV1,
    TablePaginatorSearch,
    Vista,
} from 'src/app/utils/models';
import { UserRecordService } from './modals/user-record/user-record.service';
import { Router } from '@angular/router';
import { ModulesCatalogDTO } from 'src/app/utils/models/modules-catalog.dto';
import { saveAs } from 'file-saver';
import { BasicNotification } from 'src/app/utils/helpers/basicNotification';

import { FormControl } from '@angular/forms';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss'],
    standalone: false
})
export class UsersComponent implements OnInit {
    @ViewChild('input', { static: true }) inputSearch: ElementRef;
    @ViewChild('paginator', { static: true }) readonly paginator: MatPaginator;
    data: CatalogoUsuarioDTOV1[];
    dataSource: MatTableDataSource<CatalogoUsuarioDTOV1>;
    selection: SelectionModel<CatalogoUsuarioDTOV1>;
    disabled: boolean;
    filters: TablePaginatorSearch;
    pageIndex: number;
    pageSize: number;
    length: number;
    thisAccess: Vista;
    thisModule: ModulesCatalogDTO;
    permission: boolean;
    permissions: string[];

    searchControl = new FormControl();
    
    constructor(
        private router: Router,
        private readonly userRecord: UserRecordService,
        private readonly users: UsersService,
        private basicNotification: BasicNotification,
        private access : Vista,
    ) {
        this.data = [];
        this.dataSource = new MatTableDataSource<CatalogoUsuarioDTOV1>([]);
     
        this.selection = new SelectionModel<CatalogoUsuarioDTOV1>(true);
        this.disabled = null;
        this.permission = null;
        this.filters = new TablePaginatorSearch();
        // this.permissions = [false, false, false];
        this.permissions = [];
    }

    ngOnInit(): void {
        this.setPermissions();
        this.pageSize = 25;
        this.pageIndex = this.filters.pageNumber;
        this.filters.pageSize = 25;
        this.filters.filter = {};
        this.getAllUsers(this.filters);
        
        this.searchControl.valueChanges.pipe(
            debounceTime(700), // Espera 700ms después de que el usuario deja de escribir
            distinctUntilChanged() // Emitir solo si el valor es diferente del último emitido
          ).subscribe(value => {
            this.applyFilter(value);
          });

    }

    editUser(user: CatalogoUsuarioDTOV1): void { 
        this.userRecord
            .open({ data: user, modoLectura: false })
            .afterClosed()
            .subscribe(() => this.getAllUsers(this.filters));
    }
    viewUser(user: CatalogoUsuarioDTOV1): void { 
        this.userRecord
            .open({ data: user, modoLectura: true })
            .afterClosed()
            ;
    }

    deleteUserByConfimation(user: CatalogoUsuarioDTOV1): void {
        Alert.confirm('Eliminar usuario', `¿Deseas eliminar el usuario?`).subscribe((result) => {
            if (!result || !result.isConfirmed) {
                return;
            }
            this.deleteUser(user);
        });
    }

    disableUserByConfimation(user: CatalogoUsuarioDTOV1): void {
        Alert.confirm(
            'Habilitar/Deshabilidar Usuario',
            `¿Deseas ${user.activo ? 'Deshabilitar' : 'Habilitar'} el Perfil?`
        ).subscribe((result) => {
            if (!result || !result.isConfirmed) {
                return;
            }
            this.disableUser(user);
        });
    }

    openUserRecord(): void {
        this.userRecord
            .open()
            .afterClosed()
            .subscribe(() => this.getAllUsers(this.filters));
    }

    search(term: string): void {
        // this.dataSource.filter = term;
        this.filters.pageNumber = 0;
        this.dataSource.paginator = this.paginator;
    }

    paginatorChange(event: PageEvent): void {
        this.filters.pageSize = event.pageSize;
        this.filters.pageNumber = event.pageIndex;
        this.getAllUsers(this.filters);
    }

    getAllUsersExcel(): void {
        this.users.getAllUsersExcel(this.filters).subscribe((response) => saveAs(response, 'Usuarios.xlsx'));
    }

    private deleteUser(user: CatalogoUsuarioDTOV1): void {
        this.users.deleteUser(user.id).subscribe((response) => {
            if (response.exito) {
                this.basicNotification.notif('success', 'Usuario eliminado correctamente');
                this.paginator.firstPage();
                this.getAllUsers(this.filters);
            } else {
                console.error(response.mensaje);
                this.basicNotification.notif('error', 'No se puede eliminar el Usuario');
                
            }
        });
    }

    public disableUser(user: CatalogoUsuarioDTOV1): void {
        const msg = `Usuario ${user.activo ? 'inactivado' : 'activado'} correctamente`;
        this.users.disableUser(user.id, !user.activo).subscribe((response) => {
            if (response.exito) {
                this.basicNotification.notif('success', msg);
                this.paginator.firstPage();
                this.getAllUsers(this.filters);
            } else {
                this.basicNotification.notif('error', `No se puede ${!user.activo ? 'inactivar' : 'activar'} el Usuario`);
                
            }
        });
    }

    private getAllUsers(filters: TablePaginatorSearch): void {
        this.dataSource.data = [];
        this.data = [];
        
        this.users.getAllUsers(filters).subscribe((response) => {
            if (response.output) {
                this.data = response.output.map((user) => new CatalogoUsuarioDTOV1().deserialize(user));
                this.dataSource.data = this.data;
                this.pageIndex = response.paginacion.pagina;
                this.pageSize = response.paginacion.registros;
                this.length = response.paginacion.count;
                //console.log(this.data);
            }
        });
    }

    getRegionesList(regiones: RegionDTOV1[]): string {
        let html = '<ul>';
        if (regiones) {
            regiones.forEach((item) => {
                html += `<li>${item.clave} - ${item.nombre}</li>`;
            });
            html += '</ul>';
        } else html = '';
        return html;
    }

    getCampusList(campus: CampusDTOV1[]): string {
        let html = '<ul>';
        if (campus) {
            campus.forEach((item) => {
                html += `<li>${item.clave} - ${item.nombre}</li>`;
            });
            html += '</ul>';
        } else html = '';
        return html;
    }

    getAreasList(areas: AreaResponsableDTOV1[]): string {
        let html = '<ul>';
        if (areas) {
            areas.forEach((item) => {
                html += `<li>${item.nombre}</li>`;
            });
            html += '</ul>';
        } else html = '';
        return html;
    }

    private setPermissions(): void {
        this.permissions = this.access.getPermissionsV2(this.users.userSession.permisosRolesVistas,this.router.url );
      
      }
      
      checkPermission(p: string): boolean {
        return this.permissions?.some(r => r.trim() == p.trim())
      }


    applyFilter(filterValue: any) {
        if (filterValue.length > 2 || filterValue.length == 0) {
            this.filters.filter = {
                nombre: filterValue.trim().toLowerCase(),
                apellidos: filterValue.trim().toLowerCase(),
            };
            this.filters.pageNumber = 0;
            this.pageIndex = this.filters.pageNumber;
            this.getAllUsers(this.filters);
            // this.dataSource.filter = filterValue.trim().toLowerCase();
        }
    }
}
