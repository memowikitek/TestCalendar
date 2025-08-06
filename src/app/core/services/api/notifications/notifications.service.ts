import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseV1 } from 'src/app/utils/interfaces';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { NotificacionesAllDTO, BuzonNotificacionesAllDTO, PageResultV1, TablePaginatorSearch } from 'src/app/utils/models';
import { id_ID } from 'ng-zorro-antd/i18n';

@Injectable({ providedIn: 'root' })
export class NotificationsService {

  constructor(private http: HttpClient, private dialog: MatDialog) { }

  /* NOTIFICATION SETTINGS */////////////////
  getAllNotifications(filters: TablePaginatorSearch): Observable<ResponseV1<PageResultV1<NotificacionesAllDTO[]>>> {
    return this.http.get<ResponseV1<PageResultV1<NotificacionesAllDTO[]>>>(environment.api.concat('/Notificaciones/GetAll'), {
      params: {
        filtro: JSON.stringify(filters.filter),
        pageNumber: filters.pageNumber,
        pageSize: filters.pageSize
      },
    });
  }

  //GetById
  getNotificacionById(Id: number): Observable<ResponseV1<never>> {
    return this.http.get<ResponseV1<never>>(environment.api.concat(`/Notificaciones/GetById?id=${Id}`));
  }

  //Save Notificacion
  createNotification(body: NotificacionesAllDTO): Observable<ResponseV1<never>> {
    return this.http.post<ResponseV1<never>>(environment.api.concat('/Notificaciones/Add'), body);
  }

  //Edit Notificacion
  updateNotification(body: NotificacionesAllDTO): Observable<ResponseV1<never>> {
    return this.http.put<ResponseV1<never>>(environment.api.concat('/Notificaciones/Update'), body);
  }

  //Cancel Notificacion
  cancelNotification(Id: number): Observable<ResponseV1<never>> {
    return this.http.post<ResponseV1<never>>(environment.api.concat(`/Notificaciones/CancelSend?id=${Id}`), {});
  }

  //Delete Notificacion
  deleteNotification(Id: number): Observable<ResponseV1<never>> {
    return this.http.delete<ResponseV1<never>>(environment.api.concat(`/Notificaciones/Delete/?id=${Id}`));
  }

  //Send Notificacion
  postSendNotification(body: NotificacionesAllDTO): Observable<ResponseV1<never>> {
    return this.http.post<ResponseV1<never>>(environment.api.concat('/Notificaciones/SendNotificacion'), body);
  }


  /* BUZON */////////////////
  getAllBuzonNotifications(filters: TablePaginatorSearch): Observable<ResponseV1<PageResultV1<BuzonNotificacionesAllDTO[]>>> {
    return this.http.get<ResponseV1<PageResultV1<BuzonNotificacionesAllDTO[]>>>(environment.api.concat('/Buzon/GetAll'), {
      params: {
        filtro: JSON.stringify(filters.filter),
        pageNumber: filters.pageNumber,
        pageSize: filters.pageSize
      },
    });
  }

  //ReadById
  getAllBuzonReadById(Id: number): Observable<ResponseV1<never>> {
    return this.http.get<ResponseV1<never>>(environment.api.concat(`/Buzon/ReadByBuzonId?buzonId=${Id}`));
  }

  //ReadByUserId
  getAllBuzonReadByUserId(Id: number): Observable<ResponseV1<never>> {
    return this.http.get<ResponseV1<never>>(environment.api.concat(`/Buzon/ReadByUserId?usuarioId=${Id}`));
  }

  //GetAllByUsuarioId
  getAllBuzonByUsuarioId(Id: number, filters: TablePaginatorSearch): Observable<ResponseV1<BuzonNotificacionesAllDTO>> {
    return this.http.get<ResponseV1<BuzonNotificacionesAllDTO>>(environment.api.concat(`/Buzon/GetAllByUsuarioId?usuarioId=${Id}`), {
      params: {
        filtro: JSON.stringify(filters.filter),
        pageNumber: filters.pageNumber,
        pageSize: filters.pageSize
      },
    });
  }

  getAllBuzonByUsuarioIdVisor(Id: number): Observable<ResponseV1<BuzonNotificacionesAllDTO>> {
    return this.http.get<ResponseV1<BuzonNotificacionesAllDTO>>(environment.api.concat(`/Buzon/GetAllByUsuarioId?usuarioId=${Id}`));
  }

  //GetAllByNotificacionId
  getAllBuzonByNotificacionId(Id: number, filters: TablePaginatorSearch): Observable<ResponseV1<PageResultV1<BuzonNotificacionesAllDTO>>> {
    return this.http.get<ResponseV1<PageResultV1<BuzonNotificacionesAllDTO>>>(environment.api.concat(`/Buzon/GetAllByNotificacionId?notificacionId=${Id}`), {
      params: {
        filtro: JSON.stringify(filters.filter),
        pageNumber: filters.pageNumber,
        pageSize: filters.pageSize
      },
    });
  }

  /* CATALOGOS */////////////////
  //CAMPUS
  getCampusIds(IdCiclo: any): Observable<ResponseV1<never>> {
    return this.http.post<ResponseV1<never>>(environment.api.concat(`/CatCampus/GetByCiclo`), {
      ciclosId: IdCiclo
    });
  }
  //AREA RESPONSABLE
  getAreaResponsableIds(IdCiclo: any): Observable<ResponseV1<never>> {
    return this.http.post<ResponseV1<never>>(environment.api.concat(`/CatAreaResponsable/GetByCiclo`), {
      ciclosId: IdCiclo
    });
  }
  //ESTATUS
  getEstatus(): Observable<ResponseV1<never>> {
    return this.http.get<ResponseV1<never>>(environment.api.concat('/Notificaciones/GetEstatus'));
  }
}
