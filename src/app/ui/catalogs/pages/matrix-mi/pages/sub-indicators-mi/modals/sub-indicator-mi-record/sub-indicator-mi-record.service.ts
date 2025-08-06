import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SubIndicadorMIDTOV1 } from 'src/app/utils/models';
import { SubIndicatorMiRecordComponent } from './sub-indicator-mi-record.component';

export interface SubIndicatorMIData {
    data: SubIndicadorMIDTOV1;
}
@Injectable({
    providedIn: 'root',
})
export class SubIndicatorMiRecordService {
    constructor(private dialog: MatDialog) {}

    open(data?: SubIndicatorMIData): MatDialogRef<SubIndicatorMiRecordComponent> {
        return this.dialog.open<SubIndicatorMiRecordComponent, SubIndicatorMIData>(SubIndicatorMiRecordComponent, {
            panelClass: '',
            data: data || null,
            minWidth: '40vw',
            maxHeight: '90vh',
        });
    }
}
