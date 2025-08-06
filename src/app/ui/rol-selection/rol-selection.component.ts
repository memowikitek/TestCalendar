import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { RolesService, SettingsWelcomeService, UsersService } from 'src/app/core/services';
import { Perfil, Rol, SettingsWelcomeDTO, TablePaginatorSearch } from 'src/app/utils/models';
import { UsuarioRolProcesoDTOV2 } from 'src/app/utils/models/usuario-rol-procesoV2.dto';
import { PageEvent } from '@angular/material/paginator';
import { Auth } from 'src/app/utils/helpers';
import { PermisosRolesVistasDTO } from 'src/app/utils/models/permisos-roles-vistas';

@Component({
    selector: 'app-rol-selection',
    templateUrl: './rol-selection.component.html',
    styleUrls: ['./rol-selection.component.scss'],
})
export class RolSelectionComponent implements OnInit {
    data: UsuarioRolProcesoDTOV2[];
    record: UsuarioRolProcesoDTOV2;
    dataSource: MatTableDataSource<UsuarioRolProcesoDTOV2>;
    selection: SelectionModel<UsuarioRolProcesoDTOV2>;
    disabled: boolean;
    filters: TablePaginatorSearch;
    permission: boolean;
    permissions: boolean[];
    pageIndex: number;
    pageSize: number;
    length: number;
    usuarioSesionId: number;
    userSession: Perfil;
    dataPermisos: PermisosRolesVistasDTO[];

    constructor(
       private readonly role: RolesService,
       private users: UsersService,
      
       
    ) {
        this.data = [];
    this.permission = null;
    this.dataSource = new MatTableDataSource<UsuarioRolProcesoDTOV2>([]);
    this.filters = new TablePaginatorSearch();
    }

    ngOnInit(): void {
        this.pageSize = 25;
        this.pageIndex = this.filters.pageNumber;
        this.filters.pageSize = 25;
        this.filters.filter = {};
        this.getAllRoles(this.filters);
        
    }

    private getAllRoles(filters: TablePaginatorSearch): void {
        this.dataSource.data = [];
        this.data = [];
        filters.inactives = true;
        this.pageIndex = 0;
        this.pageSize = 0;
        this.length = 0;
        this.usuarioSesionId = this.users.userSession.id;
        this.role.getRolProcesoById(filters, this.usuarioSesionId).subscribe((response) => {
            if (response.output) {
                this.data = response.output.map((usuarioProceso) => new UsuarioRolProcesoDTOV2().deserialize(usuarioProceso));
                this.dataSource.data = this.data;
                this.pageIndex = response.paginacion.pagina;
                this.pageSize = response.paginacion.registros;
                this.length = response.paginacion.count;
            }
        });
    }

    redirectEdit(user: UsuarioRolProcesoDTOV2): void {

        // console.log("Datos de sesion" + JSON.stringify(Auth.getSession()))
        this.userSession = Auth.getSession();

        this.role.getMPermisosVistaRol(user.rolId).subscribe((response) => {
            if (response.output) {
                this.dataPermisos = response.output.map((rolVistaPermisos) => new PermisosRolesVistasDTO().deserialize(rolVistaPermisos));
                this.userSession.permisosRolesVistas = this.dataPermisos ;
                this.userSession.rolSelectedId = user.rolId;
                Auth.login(this.userSession);

                 // localStorage.setItem("roleSelectedId", user.rolId.toString() );
        
        localStorage.setItem("validMenu", "true");
                
 
        window.location.assign("/welcome-screen");
            }
        });

       
      }

    paginatorChange(event: PageEvent): void {
        this.filters.pageSize = event.pageSize;
        this.filters.pageNumber = event.pageIndex;
        this.getAllRoles(this.filters);
    }
}
