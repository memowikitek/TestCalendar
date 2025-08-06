import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {  DetailsIndicatorDTOV1, EvidenceDTO, NormativaDTOV1, TablePaginatorSearch } from 'src/app/utils/models';
import { MisionRecordComponent } from './mision-record.component'
import { ComponenteCEMIDTO } from 'src/app/utils/models';
//import { IndicadorNormativa } from 'src/app/utils/models/indicador-normativa';
export interface MisionData {
  data: ComponenteCEMIDTO;
}

@Injectable({
  providedIn: 'root'
})
export class MisionRecordService {


  constructor(private dialog: MatDialog) {}
  open(data?: any): MatDialogRef<MisionRecordComponent> {
    return this.dialog.open<MisionRecordComponent, MisionData>(MisionRecordComponent, {
        panelClass: '',
        data: data || null,
        maxHeight: '120vh',
        minWidth: '90vw',
      });

  }
}
