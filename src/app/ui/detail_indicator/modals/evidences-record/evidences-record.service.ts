import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {  DetailsIndicatorDTOV1, EvidenceDTO, NormativaDTOV1, TablePaginatorSearch } from 'src/app/utils/models';
import { EvidencesRecordComponent } from './evidences-record.component'
import { IndicadorNormativa } from 'src/app/utils/models/indicador-normativa';

export interface EvidenciaData {
  data: EvidenceDTO;
}


@Injectable({
  providedIn: 'root'
})
export class EvidencesRecordService {

  constructor(private dialog: MatDialog) {}
  open(data?: any): MatDialogRef<EvidencesRecordComponent> {
    return this.dialog.open<EvidencesRecordComponent, EvidenciaData>(EvidencesRecordComponent, {
        panelClass: '',
        data: data || null,
        width: '100vw',
        height: '80vh',
        maxHeight: '100vh',
        maxWidth: '100vw',            
});

  }

}
