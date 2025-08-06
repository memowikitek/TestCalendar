import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {  AuditDTOV1 } from 'src/app/utils/models';
import { AuditRecordComponent } from './audit-record.component'


export interface AuditData {
    data: AuditDTOV1;
}

@Injectable({ providedIn: 'root' })
export class AuditRecordService {
    constructor(private dialog: MatDialog) {}

    open(data?: AuditData): MatDialogRef<AuditRecordComponent> {
        return this.dialog.open<AuditRecordComponent, AuditData>(AuditRecordComponent, {
            panelClass: '',
            data: data || null,
            minWidth: '50vw',
            maxHeight: '100vh',

        });
    }
}
