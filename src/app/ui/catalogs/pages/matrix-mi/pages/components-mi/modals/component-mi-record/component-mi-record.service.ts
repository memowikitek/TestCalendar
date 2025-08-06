import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ComponenteMIDTOV1 } from 'src/app/utils/models';
import { ComponentMiRecordComponent } from './component-mi-record.component';

export interface ComponenteMIData {
    data: ComponenteMIDTOV1;
}
@Injectable({
    providedIn: 'root',
})
export class ComponentMiRecordService {
    constructor(private dialog: MatDialog) {}

    open(data?: ComponenteMIData): MatDialogRef<ComponentMiRecordComponent> {
        return this.dialog.open<ComponentMiRecordComponent, ComponenteMIData>(ComponentMiRecordComponent, {
            panelClass: '',
            data: data || null,
            minWidth: '40vw',
            maxHeight: '90vh',
        });
    }
}
