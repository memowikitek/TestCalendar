import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {  DetailsIndicatorDTOV1, EvidenceDTO, NormativaDTOV1, TablePaginatorSearch } from 'src/app/utils/models';
import { AreaResponsableComponent } from './area-responsable.component'
import { MisionData } from '../mision-record/mision-record.service';
//import { IndicadorNormativa } from 'src/app/utils/models/indicador-normativa';
export interface AreaResponsableData {

}

@Injectable({
  providedIn: 'root'
})
export class AreaResponsableService {

  constructor(private dialog: MatDialog) {}
  open(data?: MisionData): MatDialogRef<AreaResponsableComponent> {
    return this.dialog.open<AreaResponsableComponent, MisionData>(AreaResponsableComponent, {
        panelClass: '',
        data: data || null,
        maxHeight: '90vh',
        minWidth: '40vw',
      });

  }
}
