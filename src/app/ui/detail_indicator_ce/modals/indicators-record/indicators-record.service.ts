import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {  IndicadoresDTOV1 } from 'src/app/utils/models';
import { IndicatorsCeRecordComponent } from './indicators-record.component'
import { ReactiveFormsModule } from '@angular/forms';

export interface IndicadorData {
  data: IndicadoresDTOV1;
}

@Injectable({
  providedIn: 'root'
})
export class IndicatorsCeRecordService {

  constructor(private dialog: MatDialog) {}
  open(data?: IndicadorData): MatDialogRef<IndicatorsCeRecordComponent> {
    return this.dialog.open<IndicatorsCeRecordComponent, IndicadorData>(IndicatorsCeRecordComponent, {
      panelClass: '',
      data: data || null,
      maxHeight: '90vh',
      minWidth: '40vw',
});
}


}
