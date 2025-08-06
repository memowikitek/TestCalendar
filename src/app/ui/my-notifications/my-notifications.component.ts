import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { DatePipe } from '@angular/common';
import { NotificationsService, UsersService } from 'src/app/core/services';
import { BuzonNotificacionesAllDTO, TablePaginatorSearch } from 'src/app/utils/models';

@Component({
    selector: 'app-my-notifications',
    templateUrl: './my-notifications.component.html',
    styleUrls: ['./my-notifications.component.scss'],
    providers: [DatePipe] // Agregar DatePipe como provider
    ,
    standalone: false
})
export class MyNotificationsComponent implements OnInit {
  @ViewChild('input', { static: true }) inputSearch: ElementRef;
  @ViewChild('paginator', { static: true }) readonly paginator: MatPaginator;

  idUser: number;
  data: BuzonNotificacionesAllDTO[];
  dataSource: MatTableDataSource<BuzonNotificacionesAllDTO>;
  filters: TablePaginatorSearch;
  pageIndex: number;
  pageSize: number;
  length: number;

  constructor(
    private readonly NotiService: NotificationsService,
    private users: UsersService,
    private datePipe: DatePipe
  ) {
    this.dataSource = new MatTableDataSource<BuzonNotificacionesAllDTO>([]);
    this.filters = new TablePaginatorSearch();
  }

  ngOnInit(): void { //console.log(this.users.userSession);
    const { id } = this.users.userSession;
    this.idUser = id;
    this.pageSize = 25;
    this.pageIndex = this.filters.pageNumber;
    this.filters.pageSize = 25;
    this.filters.filter = {};
    this.getNotificacionUsuarioId(this.idUser, this.filters);
  }

  //METHODS
  private getNotificacionUsuarioId(Id: number, filters: TablePaginatorSearch): void {
    this.dataSource.data = [];
    this.data = [];
    this.NotiService.getAllBuzonByUsuarioId(Id, filters).subscribe((response) => {
      if (response.output) {
        this.data = response.output.map((res) => new BuzonNotificacionesAllDTO().deserialize(res));console.log('NotificacionesUsuarioId:',this.data);
        this.dataSource.data = this.data;
        this.pageIndex = response.paginacion.pagina;
        this.pageSize = response.paginacion.registros;
        this.length = response.paginacion.count;
      }
    });
  }

  paginatorChange(event: PageEvent): void {
    this.filters.pageSize = event.pageSize;
    this.filters.pageNumber = event.pageIndex;
    this.getNotificacionUsuarioId(this.idUser, this.filters);
  }

  //Buscador
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (filterValue.length > 2 || filterValue.length == 0) {
      this.filters.filter = { searchTerm: filterValue.trim().toLowerCase() };
      this.filters.pageNumber = 0;
      this.pageIndex = this.filters.pageNumber;
      this.getNotificacionUsuarioId(this.idUser, this.filters);
      //this.dataSource.filter = filterValue.trim().toLowerCase();
    }
  }

  obtenerFechaFormateada(fecha: string): string {
    return this.datePipe.transform(fecha, 'dd/MM/yyyy') || '';
  }

  notiLeida(Id: number, status: boolean) {
    if (!status) {console.log(Id, status);
      this.NotiService.getAllBuzonReadById(Id).subscribe((response) => {
        if(response.exito){//console.log('Notificación ('+Id+') Leida');
          this.getNotificacionUsuarioId(this.idUser, this.filters);
        }
      });
    }
  }

  notiLeidas(Id: any) {
    this.NotiService.getAllBuzonReadByUserId(Id).subscribe((response) => {
      if (response.exito) {//console.log('Notificaciones Leidas para el usuario: ' + Id);
        this.getNotificacionUsuarioId(this.idUser, this.filters);
      }
    });
  }
}
