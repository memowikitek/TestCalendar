import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { RegionsService, UsersService } from 'src/app/core/services';
import { ValidatorService } from 'src/app/shared/validators';
import { Alert, clearForm } from 'src/app/utils/helpers';
import { ModalidadDTOV1, TablePaginatorSearch, Vista } from 'src/app/utils/models';
import { ModalityData } from './modality-record.service';
import { ModuleIdV2 } from 'src/app/utils/enums/modules-idV2';
import { ModalityService } from 'src/app/core/services/api/modality/modality.service';
import { Router } from '@angular/router';

export enum ModalTitle {
    NEW = 'Nuevo Nivel / Modalidad',
    EDIT = 'Editar Nivel / Modalidad',
}

@Component({
    selector: 'app-modality',
    templateUrl: './modality-record.component.html',
    styleUrls: ['./modality-record.component.scss'],
})
export class ModalityRecordComponent implements OnInit, OnDestroy {
    modalityRecordForm: FormGroup;
    title: ModalTitle;
    data: ModalidadDTOV1;
    edit: boolean;
    subscription: Subscription;
    disabled: boolean;
    permission: boolean;
    modalityList: ModalidadDTOV1[];
    thisAccess: Vista;
    permissions: boolean[];
    constructor(
        @Inject(MAT_DIALOG_DATA)
        public readonly modalityData: ModalityData,
        private router: Router,
        private readonly formBuilder: FormBuilder,
        private readonly modality: ModalityService,
        private readonly ref: MatDialogRef<never>,
        private regions: RegionsService,
        private users: UsersService,
        private readonly validator: ValidatorService
    ) {
        this.title = ModalTitle.NEW;
        this.data = new ModalidadDTOV1();
        this.edit = null;
        this.disabled = null;
        this.permission = null;
        this.modalityList = [];
        this.subscription = new Subscription();
        this.modalityRecordForm = this.formBuilder.group({
            nombre: [null, [Validators.required, Validators.maxLength(100), this.validator.noWhitespace]],
            activo: [true, []],
        });
        this.thisAccess = new Vista();
        this.permissions = [false, false, false];
    }

    ngOnInit() {
        this.setPermissions();
        this.disabled = !this.checkPermission(2);
        this.title = this.modalityData ? ModalTitle.EDIT : ModalTitle.NEW;
        if (this.modalityData) {
            this.modality.getModalityById(this.modalityData.data.id).subscribe((response) => {
                if (!response.output) {
                    return;
                }
                const data = new ModalidadDTOV1().deserialize(response.output[0]);
                this.data = data;
                this.modalityRecordForm.patchValue(data);
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
        this.modalityRecordForm.markAllAsTouched();
        if (this.modalityRecordForm.invalid) {
            Alert.error('Verifique que los campos sean correctos');
            return;
        }
        clearForm(this.modalityRecordForm);
        const tmp = this.modalityRecordForm.getRawValue();
        const modality: ModalidadDTOV1 = new ModalidadDTOV1().deserialize(tmp);
        if (this.data.id) {
            modality.id = this.data.id;
            modality.fechaCreacion = this.data.fechaCreacion;
            modality.usuarioCreacion = this.data.usuarioCreacion;
            modality.fechaModificacion = new Date();
            modality.usuarioModificacion = this.users.userSession.id;
            this.modality.updateModality(modality).subscribe(() => {
                Alert.success('', 'Modalidad actualizado correctamente');
                this.ref.close(true);
            });
        } else {
            modality.fechaCreacion = new Date();
            modality.usuarioCreacion = this.users.userSession.id;
            this.modality.createModality(modality).subscribe(() => {
                Alert.success('', 'Modalidad creado correctamente');
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
        this.subscription.add(this.modalityRecordForm.statusChanges.subscribe(() => (this.edit = true)));
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
