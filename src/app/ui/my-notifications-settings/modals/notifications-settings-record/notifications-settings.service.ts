import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NotificacionesAllDTO } from 'src/app/utils/models';//
import { NotificationsSettingsRecordComponent } from './notifications-settings-record.component';

export interface NotiData {data: NotificacionesAllDTO;}

@Injectable({providedIn: 'root'})

export class NotificationsSettingsRecordService {

  constructor(private dialog: MatDialog) { }
  open(data?: NotiData): MatDialogRef<NotificationsSettingsRecordComponent> {//console.log(data);
    return this.dialog.open<NotificationsSettingsRecordComponent, NotiData>(NotificationsSettingsRecordComponent, {
      panelClass: '',
      data: data || null,
      width: '60vw',
      maxHeight: '85vh',
      minWidth: '60vw',
    });
  }

}
