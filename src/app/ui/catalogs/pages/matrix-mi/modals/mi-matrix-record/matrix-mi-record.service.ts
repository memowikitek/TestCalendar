import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatrizMIDTOV1 } from 'src/app/utils/models';
import { MatrixMiRecordComponent } from './matrix-mi-record.component';

export interface MatrixMIData {
    data: MatrizMIDTOV1;
}
@Injectable({
    providedIn: 'root',
})
export class MatrixMiRecordService {
    constructor(private dialog: MatDialog) {}

    open(data?: MatrixMIData): MatDialogRef<MatrixMiRecordComponent> {
        return this.dialog.open<MatrixMiRecordComponent, MatrixMIData>(MatrixMiRecordComponent, {
            panelClass: '',
            data: data || null,
            maxHeight: '60vh',
            maxWidth: '60vh',
        });
    }
}
