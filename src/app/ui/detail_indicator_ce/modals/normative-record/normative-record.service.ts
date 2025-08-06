import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {  DetailsIndicatorDTOV1, DetailsCeIndicatorNormativaDTOV1, TablePaginatorSearch } from 'src/app/utils/models';
import { NormativeRecordComponent } from './normative-record.component'
import { IndicadorNormativa } from 'src/app/utils/models/indicador-normativa';

export interface NormativaData {
  data: DetailsCeIndicatorNormativaDTOV1;
}


@Injectable({
  providedIn: 'root'
})
export class NormativeRecordService {

  constructor(private dialog: MatDialog) {}
  open(data?: any): MatDialogRef<NormativeRecordComponent> {
    return this.dialog.open<NormativeRecordComponent, NormativaData>(NormativeRecordComponent, {
        panelClass: '',
        data: data || null,
            width: '100vw',
            height: '80vh',
            maxHeight: '100vh',
            maxWidth: '100vw',            
    });

  }
}