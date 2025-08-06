import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { CicloEvaDTOV1, TablePaginatorSearch, Vista } from 'src/app/utils/models';
import { EvaluationCycleService, UsersService } from 'src/app/core/services';
import { environment } from 'src/environments/environment';
import { PermisosHeredadosDTO } from 'src/app/utils/models/permisos-heredados.dto';

@Component({
  selector: 'app-mis-evaluaciones',
  templateUrl: './mis-evaluaciones.component.html',
  styleUrls: ['./mis-evaluaciones.component.scss'],
  providers: [DatePipe] // Agregar DatePipe como provider
})

export class MisEvaluacionesComponent implements OnInit {
  permission: boolean;
  permissions: string[];
  pageIndex: number;
  pageSize: number;
  length: number;
  filters: TablePaginatorSearch;
  dataSource: MatTableDataSource<CicloEvaDTOV1>;
  data: CicloEvaDTOV1[];
  showCard: boolean = false;
  ciclos: any;
  proceso: any;
  rol: any;
  pagesChild: boolean;
  cover: any;
  data2: any;

  constructor(
    private access: Vista,
    private readonly router: Router,
    private readonly EvaCS: EvaluationCycleService,
    private users: UsersService
  ) {
    this.permission = null;
    this.permissions = [];
  }

  ngOnInit(): void {
    //todo: revisar seguridad
    this.setPermissions();
    this.pagesChild = this.getCurrentRoute.includes('/mis-evaluaciones/ciclo-etapas');//console.log(this.pagesChild);
    if (!this.pagesChild) {
      this.getProcess();
      this.getAllCycleEva();
    }
  }

  //METHODS
  private getAllCycleEva(): void {
    let filters = new TablePaginatorSearch();
    filters.filter = {
      procesoEvaluacion: this.proceso,
      activo: true
    };
    filters.pageSize = 0;
    filters.pageNumber = 0;
    const today = this.fechaActual();
    this.EvaCS.getCEEvaluacion(filters, today).subscribe((response) => {
      if (response.output) {
        this.data = response.output.map((eva) => new CicloEvaDTOV1().deserialize(eva)); //console.log(this.data);
        this.ciclos = this.data; //console.log(this.ciclos);
        this.showCard = this.ciclos.length > 0; //console.log(this.showCard);
      }
    });
  }

  getProcess() {
    const process = JSON.parse(localStorage.getItem('process')); //console.log(process);
    if (process) {
      const { rol, proceso } = process;
      this.proceso = proceso;
    }
  }

  misEvaluaciones(): void {
    this.showCard = true;
  }

  fechaActual() {
    let date = new Date();
    let day = date.getDate();
    let dd = (day < 10) ? `0${day}` : day;
    let month = date.getMonth() + 1;
    let mm = (month < 10) ? `0${month}` : month;
    let yy = date.getFullYear();
    let fecha = `${yy}-${mm}-${dd}`;
    return fecha;
  }

  get getCurrentRoute(): string {
    return this.router.url;
  }

  private setPermissions(): void {
    this.permissions = this.access.getPermissionsV2(this.users.userSession.permisosRolesVistas, this.router.url);
  }

  checkPermission(p: string): boolean {
    return this.permissions?.some(r => r.trim() == p.trim())
  }

  setPermisosHeredados(urlRedirect: string) {
    var permiso = new PermisosHeredadosDTO();
    permiso.vistaPadre = this.router.url;
    permiso.vistaHijo = urlRedirect;

    var permisosHeredados: PermisosHeredadosDTO[] = JSON.parse(localStorage.getItem('permisosHeredados'));
    if (permisosHeredados == null) {
      permisosHeredados = [];
      permisosHeredados.push(permiso);
    } else {
      var permisoFind = permisosHeredados.find(p => p.vistaHijo == urlRedirect)
      if (permisoFind == null) {
        permisosHeredados.push(permiso);
      }
    }
    localStorage.setItem('permisosHeredados', JSON.stringify(permisosHeredados));
  }

}
