import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CatalogoRolesDTO } from 'src/app/utils/models';
import { RolRecordComponent } from './rol-record.component';

export interface RolData {
    data: CatalogoRolesDTO;
    modoLectura: boolean;
}

@Injectable()
export class RolRecordService {
    constructor(private dialog: MatDialog) { }

    open(data?: RolData): MatDialogRef<RolRecordComponent> {
        return this.dialog.open<RolRecordComponent, RolData>(RolRecordComponent, {
            panelClass: '',
            data: data || null,
            minWidth: '60vw',
            maxHeight: '90vh',
            maxWidth: '70vh'
        });
    }
}


