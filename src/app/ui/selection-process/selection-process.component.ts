import { Component, OnInit } from '@angular/core';
import { Perfil, TablePaginatorSearch, Vista, PermisosRolesVistasDTO } from 'src/app/utils/models';
import { UsersService, RolesProcesosService, RolesService } from 'src/app/core/services';
import { Auth } from 'src/app/utils/helpers';

@Component({
  selector: 'app-selection-process',
  templateUrl: './selection-process.component.html',
  styleUrls: ['./selection-process.component.scss']
})

export class SelectionProcessComponent implements OnInit {
  filters: TablePaginatorSearch;
  btnSiac: boolean = false;
  btnFimpes: boolean = false;
  proceso: any;
  roles: any;
  userSession: Perfil;
  dataPermisos: PermisosRolesVistasDTO[];

  constructor(
    readonly users: UsersService,
    private readonly rolesService: RolesProcesosService,
    private readonly role: RolesService
  ) { }

  ngOnInit(): void {
    this.servicesRoles();
  }

  private servicesRoles(): void {
    let filters = new TablePaginatorSearch();
    filters.pageSize = 0;
    filters.pageNumber = 0;
    const { id } = JSON.parse(localStorage.getItem('session'));
    this.rolesService.getRolProcesoById(filters, id).subscribe((response) => {
      this.roles = response.output; //console.log(this.roles);
      //Sin Autorizacion
      if (this.roles.length == 0) {
        window.location.assign('/unauthorized-rol');
      }
    });
  }

  btnProcess(item: any, process: any){//console.log(item, process);
    this.proceso = process;
    const btns = document.getElementById('listaBtns').children; //console.log(btns);
    for (let j = 0; j < btns.length; j++) {
      const clear = document.getElementById('btnRoles-' + j);
      clear.style.display = 'none';
    }
    const btn = document.getElementById(item); //console.log(btn);
    btn.style.display = 'flex';
  }

  btnRol(rol: any): void {//console.log('Rol:', rol);
    const filteredData = this.roles.filter((x: { roles: any[]; procesoNombre: string; }) => x.roles.some(y => y.nombre === rol) && x.procesoNombre === this.proceso);
    //this.roles.filter((x: { procesoNombre: any; roles: string | string[]; }) => x.procesoNombre === this.proceso);
    //console.log(filteredData[0]);
    //const {procesoNombre} = filteredData[0];
    this.userSession = Auth.getSession();
    this.role.getMPermisosVistaRol(rol.id).subscribe((response) => {
      if (response.output) {
          this.dataPermisos = response.output.map((rolVistaPermisos) => new PermisosRolesVistasDTO().deserialize(rolVistaPermisos));
          this.userSession.permisosRolesVistas = this.dataPermisos ;
          this.userSession.rolSelectedId = rol.id;
          this.userSession.isAllAreas = rol.isAllAreas;
          Auth.login(this.userSession);
          localStorage.setItem("validMenu", "true");
          const rolNombre = rol.nombre;
          const process = { rol: rolNombre, proceso: this.proceso }
          localStorage.setItem("process", JSON.stringify(process));
          window.location.assign('/mis-evaluaciones');
      }
    });
  }
}