import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SettingsWelcomeDTO } from 'src/app/utils/models';
import { WelSettingsRecordComponent } from './wel-settings-record.component';

export interface WelcomeData {data: SettingsWelcomeDTO;}

@Injectable({
  providedIn: 'root'
})

export class WelSettingsRecordService {
  constructor(private dialog: MatDialog) { }
  open(data?: WelcomeData): MatDialogRef<WelSettingsRecordComponent> {//console.log(data);
    return this.dialog.open<WelSettingsRecordComponent,WelcomeData>(WelSettingsRecordComponent, {
      panelClass: '',
      data: data || null,
      maxHeight: '100vh',
      maxWidth: '90vw',
    });
  }
}
