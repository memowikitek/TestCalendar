import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ModalityRecordComponent } from './modality-record.component';
import { ModalidadDTOV1 } from 'src/app/utils/models';

export interface ModalityData {
    data: ModalidadDTOV1;
}

@Injectable()
export class ModalityRecordService {
    constructor(private dialog: MatDialog) {}

    open(data?: ModalityData): MatDialogRef<ModalityRecordComponent> {
        return this.dialog.open<ModalityRecordComponent, ModalityData>(ModalityRecordComponent, {
            panelClass: '',
            data: data || null,
            minWidth: '40vw',
            maxHeight: '90vh',
        });
    }
}
