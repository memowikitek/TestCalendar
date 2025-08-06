import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CycleEvaDTOV1 } from 'src/app/utils/models';//
import { CycleRecordComponent } from './cycle-record.component';

export interface CycleEvaluationData {data: CycleEvaDTOV1;}

@Injectable({
  providedIn: 'root'
})

export class CycleEvaluationRecordService {

  constructor(private dialog: MatDialog) { }
  open(data?: CycleEvaluationData): MatDialogRef<CycleRecordComponent> {//console.log(data);
    return this.dialog.open<CycleRecordComponent, CycleEvaluationData>(CycleRecordComponent, {
      panelClass: '',
      data: data || null,
      width: '80vw',
      maxHeight: '100vh',
      maxWidth: '80vw',
    });
  }

}
