import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NivelDTOV1 } from 'src/app/utils/models';
import { LevelRecordComponent } from './level-record.component';

export interface levelData {
    data: NivelDTOV1;
}

@Injectable()
export class LevelRecordService {
    constructor(private dialog: MatDialog) {}

    open(data?: levelData): MatDialogRef<LevelRecordComponent> {
        return this.dialog.open<LevelRecordComponent, levelData>(LevelRecordComponent, {
            panelClass: '',
            data: data || null,
            minWidth: '40vw',
            maxHeight: '90vh',
        });
    }
}
