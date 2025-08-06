import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {  IndicadoresDTOV1 } from 'src/app/utils/models';
import { IndicatorsRecordComponent } from './indicators-record.component'

export interface IndicadorData {
  data: IndicadoresDTOV1;
}

@Injectable({
  providedIn: 'root'
})
export class IndicatorsRecordService {

  constructor(private dialog: MatDialog) {}
  open(data?: IndicadorData): MatDialogRef<IndicatorsRecordComponent> {
    return this.dialog.open<IndicatorsRecordComponent, IndicadorData>(IndicatorsRecordComponent, {
      panelClass: '',
      data: data || null,
      maxHeight: '90vh',
      minWidth: '40vw',
});
}


}
