import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { IndicadorMIDTOV1 } from 'src/app/utils/models';
import { IndicatorMiRecordComponent } from './indicator-mi-record.component';

export interface IndicatorMIData {
    data: IndicadorMIDTOV1;
}
@Injectable({
    providedIn: 'root',
})
export class IndicatorMiRecordService {
    constructor(private dialog: MatDialog) {}

    open(data?: IndicatorMIData): MatDialogRef<IndicatorMiRecordComponent> {
        return this.dialog.open<IndicatorMiRecordComponent, IndicatorMIData>(IndicatorMiRecordComponent, {
            panelClass: '',
            data: data || null,
            minWidth: '40vw',
            maxHeight: '90vh',
        });
    }
}
