import { LevelService } from './../../../../../../core/services/api/level/level.service';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { RegionsService, UsersService } from 'src/app/core/services';
import { ValidatorService } from 'src/app/shared/validators';
import { Alert, clearForm } from 'src/app/utils/helpers';
import { NivelDTOV1, TablePaginatorSearch, Vista } from 'src/app/utils/models';
import { levelData } from './level-record.service';
import { ModuleIdV2 } from 'src/app/utils/enums/modules-idV2';
import { Router } from '@angular/router';

export enum ModalTitle {
    NEW = 'Nuevo Nivel',
    EDIT = 'Editar Nivel',
}

@Component({
    selector: 'app-level',
    templateUrl: './level-record.component.html',
    styleUrls: ['./level-record.component.scss'],
})
export class LevelRecordComponent implements OnInit, OnDestroy {
    levelRecordForm: FormGroup;
    title: ModalTitle;
    data: NivelDTOV1;
    edit: boolean;
    subscription: Subscription;
    disabled: boolean;
    permission: boolean;
    levelList: NivelDTOV1[];
    thisAccess: Vista;
    permissions: boolean[];
    constructor(
        @Inject(MAT_DIALOG_DATA)
        public readonly levelData: levelData,
        private router: Router,
        private readonly formBuilder: FormBuilder,
        private readonly level: LevelService,
        private readonly ref: MatDialogRef<never>,
        private users: UsersService,
        private readonly validator: ValidatorService
    ) {
        this.title = ModalTitle.NEW;
        this.data = new NivelDTOV1();
        this.edit = null;
        this.disabled = null;
        this.permission = null;
        this.levelList = [];
        this.subscription = new Subscription();
        this.levelRecordForm = this.formBuilder.group({
            nombre: [null, [Validators.required, Validators.maxLength(100), this.validator.noWhitespace]],
            activo: [true, []],
        });
        this.thisAccess = new Vista();
        this.permissions = [false, false, false];
    }

    ngOnInit() {
        this.setPermissions();
        this.disabled = !this.checkPermission(2);
        this.title = this.levelData ? ModalTitle.EDIT : ModalTitle.NEW;
        if (this.levelData) {
            this.level.getLevelById(this.levelData.data.id).subscribe((response) => {
                if (!response.output) {
                    return;
                }
                const data = new NivelDTOV1().deserialize(response.output[0]);
                this.data = data;
                this.levelRecordForm.patchValue(data);
                this.trackingStatusForm();
            });
        } else {
            this.trackingStatusForm();
        }
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    submit(): void {
        this.levelRecordForm.markAllAsTouched();
        if (this.levelRecordForm.invalid) {
            Alert.error('Verifique que los campos sean correctos');
            return;
        }
        clearForm(this.levelRecordForm);
        const tmp = this.levelRecordForm.getRawValue();
        const level: NivelDTOV1 = new NivelDTOV1().deserialize(tmp);
        if (this.data.id) {
            level.id = this.data.id;
            level.fechaCreacion = this.data.fechaCreacion;
            level.usuarioCreacion = this.data.usuarioCreacion;
            level.fechaModificacion = new Date();
            level.usuarioModificacion = this.users.userSession.id;
            this.level.updateLevel(level).subscribe(() => {
                Alert.success('', 'Nivel actualizado correctamente');
                this.ref.close(true);
            });
        } else {
            level.fechaCreacion = new Date();
            level.usuarioCreacion = this.users.userSession.id;
            this.level.createLevel(level).subscribe(() => {
                Alert.success('', 'Nivel creado correctamente');
                this.ref.close(true);
            });
        }
    }

    closeModalByConfimation(): void {
        if (!this.edit) {
            this.ref.close();
            return;
        }
        Alert.confirm('Alerta', '¿Está seguro de que desea salir? Los datos ingresados no serán guardados.').subscribe(
            (result) => {
                if (!result || !result.isConfirmed) {
                    return;
                }
                this.ref.close();
            }
        );
    }

    private trackingStatusForm(): void {
        this.subscription.add(this.levelRecordForm.statusChanges.subscribe(() => (this.edit = true)));
    }

    private setPermissions(): void {
        this.permissions = this.thisAccess.getPermissions(
            this.users.userSession.modulos,
            this.users.userSession.vistas,
            this.router.url
        );
    }

    checkPermission(p: number): boolean {
        return this.permissions[p];
    }
}
