import { Component, ElementRef, OnInit, ViewChild, NgModule } from '@angular/core';
import { ComponenteMIDTOV1, IndicadoresDTO, IndicadoresDTOV1, TablePaginatorSearch, Vista } from 'src/app/utils/models';
import { IndicatorsService, ComponentMiService, UsersService } from 'src/app/core/services';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { IndicatorsRecordService } from './modals/indicators-record/indicators-record.service';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Alert, clearForm } from 'src/app/utils/helpers';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BasicNotification } from 'src/app/utils/helpers/basicNotification';
import saveAs from 'file-saver';
import { PermisosHeredadosDTO } from 'src/app/utils/models/permisos-heredados.dto';

@Component({
  selector: 'app-indicators',
  templateUrl: './indicators.component.html',
  styleUrls: ['./indicators.component.scss']
})

export class IndicatorsComponent implements OnInit {
  @ViewChild('paginator', { static: true }) readonly paginator: MatPaginator;
  dataSource: MatTableDataSource<IndicadoresDTOV1>;
  data: IndicadoresDTOV1[];
  filters: TablePaginatorSearch;
  pageIndex: number;
  pageSize: number;
  length: number;
  ref: any;
  isChecked: any;
  thisAccess: Vista;
  permission: boolean;
  permissions: string[];

  constructor(
    private readonly indicadoresRecord: IndicatorsRecordService,
    private readonly indicadores: IndicatorsService,
    private users: UsersService,
    private router: Router,
    private basicNotification : BasicNotification,
    private access : Vista,
  ) {
    this.data = [];
    this.dataSource = new MatTableDataSource<IndicadoresDTOV1>([]);
    this.filters = new TablePaginatorSearch();
    this.permission = null;
    this.thisAccess = new Vista();
    this.permissions = [];
    this.dataSource.filterPredicate = function (indicadores: IndicadoresDTOV1, filter: string): boolean {
      return (
        indicadores.componente.toLowerCase().includes(filter.toLowerCase())
      );
    };
  }

  ngOnInit(): void {
    this.setPermissions();
    this.filters.pageSize = 25;
    this.filters.filter = {};
    this.getAllIndicadores(this.filters);
  }

  private getAllIndicadores(filters: TablePaginatorSearch): void {
    this.dataSource.data = [];
    this.data = [];
    this.indicadores.getAll(filters).subscribe((response) => {
      this.data = response.output.map((indicadores) => new IndicadoresDTOV1().deserialize(indicadores));//console.log(this.data);
      localStorage.setItem('IndicatorsList', JSON.stringify(this.data));
      this.dataSource = new MatTableDataSource(this.data);
      this.pageIndex = response.paginacion.pagina;
      this.pageSize = response.paginacion.registros;
      this.length = response.paginacion.count;
    });
  }

  openIndicadoresRecord(): void {
    this.indicadoresRecord
      .open()
      .afterClosed()
      .subscribe(() => {
        this.getAllIndicadores(this.filters)
      }
      );
  }

  paginatorChange(event: PageEvent): void {
    this.filters.pageSize = event.pageSize;
    this.filters.pageNumber = event.pageIndex;
    this.getAllIndicadores(this.filters);
  }

  search(term: string): void {
    this.dataSource.filter = term;
    this.paginator.pageIndex = 0;
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (filterValue.length >= 0 || filterValue.length == 0) {
      this.filters.filter = {
        clave: filterValue.trim().toLowerCase(),
        nombre: filterValue.trim().toLowerCase(),
        descripcion: filterValue.trim().toLowerCase()
      };
      this.filters.pageNumber = 0;
      this.pageIndex = this.filters.pageNumber;
      this.getAllIndicadores(this.filters);
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
  }

  editAudit(indicador: IndicadoresDTOV1): void {
    this.indicadoresRecord
      .open({ data: indicador })
      .afterClosed()
      .subscribe(() => this.getAllIndicadores(this.filters));
  }

  deleteIndicator(indicador: IndicadoresDTOV1): void {
    const indicadorId = indicador.indicadorId;
    Alert.confirm('Eliminar Indicador', `¿Deseas eliminar el indicador?`).subscribe((result) => {
      if (result.isConfirmed) {
        this.indicadores.deleteIndicador(indicadorId).subscribe((response) => {
          if (response.exito){
            this.basicNotification.notif("success",'Indicador eliminado correctamente');
            this.paginator.firstPage();
            this.getAllIndicadores(this.filters);
          }else{
            console.error(response.mensaje);
            this.basicNotification.notif("error",'No se puede eliminar indicador');
          }
        });
      }
    });
  }

  onChange($event: any, indica: IndicadoresDTOV1) {
    this.isChecked = $event.checked;
    indica.activo = this.isChecked;
    this.indicadores.updateIndicador(indica).subscribe((response) => {
      if (response.exito) {
        const msg = `Indicador ${this.isChecked ? 'activado' : 'inactivado'} correctamente`;
        this.basicNotification.notif("success",msg);
        this.getAllIndicadores(this.filters);
      } else {
        this.basicNotification.notif("error",`No se puede ${!this.isChecked ? 'deshabilitar' : 'habilitar'} el indicador`);
      }
    });
  }

  redirectDetail(indicador: IndicadoresDTOV1): void {
    var urlRedirect = "/detalles-indicadores";
    localStorage.setItem('idIndicadorSiac', JSON.stringify(indicador));
   
    this.setPermisosHeredados(urlRedirect);
    window.location.assign(urlRedirect);
  }

  setPermisosHeredados(urlRedirect : string){
    var permiso = new PermisosHeredadosDTO();
      permiso.vistaPadre = this.router.url;
      permiso.vistaHijo = urlRedirect;
      
      var permisosHeredados: PermisosHeredadosDTO[] = JSON.parse(localStorage.getItem('permisosHeredados'));
      if(permisosHeredados == null ){
        permisosHeredados = [];
        permisosHeredados.push(permiso);
      }else{
        var permisoFind = permisosHeredados.find(p => p.vistaHijo == urlRedirect)
        if (permisoFind == null){
          permisosHeredados.push(permiso);
        }
      }
      localStorage.setItem('permisosHeredados', JSON.stringify(permisosHeredados));
  }

  

  private setPermissions(): void {
    this.permissions = this.access.getPermissionsV2(this.users.userSession.permisosRolesVistas,this.router.url );
  
  }

  checkPermission(p: string): boolean {
    return this.permissions?.some(r => r.trim() == p.trim())
  }
  

  getAllIndicadoresExcel(){
    this.indicadores.getAllIndicadoresExcel(this.filters).subscribe((response) => saveAs(response, 'indicadores.xlsx'));
  }
}
