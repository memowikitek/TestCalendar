import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PilarEstrategicoMIDTOV1 } from 'src/app/utils/models';
import { PilarEstrategicoMiRecordComponent } from './strategic-pillar-mi-record.component';

export interface PilarEstrategicoMIData {
    data: PilarEstrategicoMIDTOV1;
}
@Injectable({
    providedIn: 'root',
})
export class PilarEstrategicoMiRecordService {
    constructor(private dialog: MatDialog) {}

    open(data?: PilarEstrategicoMIData): MatDialogRef<PilarEstrategicoMiRecordComponent> {
        return this.dialog.open<PilarEstrategicoMiRecordComponent, PilarEstrategicoMIData>(
            PilarEstrategicoMiRecordComponent,
            {
                panelClass: '',
                data: data || null,
                minWidth: '40vw',
                maxHeight: '90vh',
            }
        );
    }
}
