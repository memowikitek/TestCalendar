import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {  AuditDTOV1, DetailsIndicatorDTOV1, NormativaDTOV1, TablePaginatorSearch } from 'src/app/utils/models';
import { RubricaRecordComponent } from './rubrica-record.component'
import { IndicadorNormativa } from 'src/app/utils/models/indicador-normativa';
import { RubricasDTOV1 } from 'src/app/utils/models/rubricas-v1.dto';

export interface RubricaData {
  dataSave: RubricasDTOV1;
}

@Injectable({
  providedIn: 'root'
})
export class RubricaServiceService {

  constructor(private dialog: MatDialog) {}
  open(dataSave?: RubricaData): MatDialogRef<RubricaRecordComponent> {
    return this.dialog.open<RubricaRecordComponent, RubricaData>(RubricaRecordComponent, {
        panelClass: '',
        data: dataSave || null,
        maxHeight: '90vh',
        minWidth: '40vw',           
});
  }

}