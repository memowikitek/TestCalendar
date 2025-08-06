import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NotificationsService, UsersService } from 'src/app/core/services';
import { BuzonNotificacionesAllDTO } from 'src/app/utils/models';

@Component({
    selector: 'app-visor-notifications',
    templateUrl: './visor-notifications.component.html',
    styleUrls: ['./visor-notifications.component.scss'],
    providers: [DatePipe] // Agregar DatePipe como provider
    ,
    standalone: false
})
export class VisorNotificationsComponent implements OnInit {
  idUser: number;
  data: any[];
  show: boolean = true;
  x: string;

  constructor(
    private readonly NotiService: NotificationsService,
    private users: UsersService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    const { id } = this.users.userSession;
    this.idUser = id;
    this.getNotificacionId(this.idUser);
  }

  //METHODS
  private getNotificacionId(Id: number): void {
    this.NotiService.getAllBuzonByUsuarioIdVisor(Id).subscribe((response) => {//console.log(response.output);
      if (response.output) {
        const data = response.output.map((res) => new BuzonNotificacionesAllDTO().deserialize(res));
        this.data = data.filter((x) => !x.estatus); //console.log('NotificacionesUsuarioId:', this.data);
        if (this.data.length == 0) {
          this.show = false;
        }
      }
    });
  }

  notiLeida(Id: any) {
    this.NotiService.getAllBuzonReadById(Id).subscribe((response) => {
      if (response.exito) {//console.log('Notificación ('+Id+') Leida');
        this.getNotificacionId(this.idUser);
      }
    });
  }

  notiLeidas(Id: any) {
    this.NotiService.getAllBuzonReadByUserId(Id).subscribe((response) => {
      if (response.exito) {//console.log('Notificaciones Leidas para el usuario: '+ Id);
        this.getNotificacionId(this.idUser);
      }
    });
  }

  obtenerFechaFormateada(fecha: string): string {
    return this.datePipe.transform(fecha, 'dd/MM/yyyy') || '';
  }

  /*getHr(value: string | null): string {
      return value?.substr(11,5) || '';
  }*/

  getHr(value: string): string {
    return this.customSubstr(value,11,5);
  }

  customSubstr(str: any, start: any, length: any) {
    // Manejo de argumentos negativos para comportamiento similar a substr()
    start = start < 0 ? Math.max(str?.length + start, 0) : Math.min(start, str?.length);
    length = (typeof length !== 'undefined') ? length : str.length;
    return str?.substring(start, start + length);
  }

}
