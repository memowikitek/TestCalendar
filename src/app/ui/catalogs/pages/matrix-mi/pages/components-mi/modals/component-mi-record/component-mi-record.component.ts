import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ComponentMiService, UsersService } from 'src/app/core/services';
import { ValidatorService } from 'src/app/shared/validators';
import { Alert, clearForm } from 'src/app/utils/helpers';
import { ComponenteMIDTOV1, Vista } from 'src/app/utils/models';
import { ModuleIdV2 } from 'src/app/utils/enums/modules-idV2';
import { Router } from '@angular/router';
import { ModulesCatalogDTO } from 'src/app/utils/models/modules-catalog.dto';
import { ComponenteMIData } from './component-mi-record.service';
import { BasicNotification } from 'src/app/utils/helpers/basicNotification';

export enum ModalTitle {
    NEW = 'Nuevo componente MI',
    EDIT = 'Editar componente MI',
}

@Component({
    selector: 'app-component-mi-record',
    templateUrl: './component-mi-record.component.html',
    styleUrls: ['./component-mi-record.component.scss'],
})
export class ComponentMiRecordComponent implements OnInit, OnDestroy {
    conponentMiRecordForm: FormGroup;
    title: ModalTitle;
    data: ComponenteMIDTOV1;
    edit: boolean;
    subscription: Subscription;
    disabled: boolean;
    permission: boolean;
    thisAccess: Vista;
    thisModule: ModulesCatalogDTO;
    permissions: boolean[];
    estatus: string;
    estatusRecord: boolean;
    constructor(
        @Inject(MAT_DIALOG_DATA)
        public readonly conponentMiData: ComponenteMIData,
        private router: Router,
        private readonly formBuilder: FormBuilder,
        private readonly ref: MatDialogRef<never>,
        private readonly validator: ValidatorService,
        private readonly conponentMiService: ComponentMiService,
        private readonly users: UsersService,
        private basicNotification : BasicNotification,
    ) {
        this.subscription = new Subscription();
        this.title = ModalTitle.NEW;
        this.data = new ComponenteMIDTOV1();
        this.edit = null;
        this.disabled = null;
        this.permission = null;
        this.conponentMiRecordForm = this.formBuilder.group({
            nombre: [null, [Validators.required, Validators.maxLength(200), this.validator.noWhitespace]],
            descripcion: [null, [Validators.required, Validators.maxLength(500), this.validator.noWhitespace]],
            activo: [true, []],
        });
        this.thisAccess = new Vista();
        this.permissions = [false, false, false];
    }

    ngOnInit(): void {
        //todo: revisar seguridad
        // this.setPermissions();
        // this.disabled = !this.checkPermission(2);
        this.disabled = false;
        

        this.title = this.conponentMiData ? ModalTitle.EDIT : ModalTitle.NEW;
        this.estatusRecord = this.conponentMiData ? this.conponentMiData.data.activo : true;
        this.estatus = this.conponentMiData ? this.conponentMiData.data.activo? "Activo":"Inactivo" : "Activo";

        if (this.conponentMiData) {
            this.conponentMiService.getComponentMiById(this.conponentMiData.data.id).subscribe((response) => {
                if (!response.output) {
                    return;
                }
                const data = new ComponenteMIDTOV1().deserialize(response.output);
                this.data = data;
                
                this.conponentMiRecordForm.patchValue(data);
                // this.conponentMiRecordForm.get('clave').disable();

                this.trackingStatusForm();
            });
        } else {
            this.trackingStatusForm();
        }
    }

    submit(): void {
        this.conponentMiRecordForm.markAllAsTouched();
        if (this.conponentMiRecordForm.invalid) {
            // Alert.error('Verifique que los campos sean correctos');
            this.basicNotification.notif("error",'Verifique que los campos sean correctos');
            return;
        }
        clearForm(this.conponentMiRecordForm);
        const tmp = this.conponentMiRecordForm.getRawValue();
        const ComponenteMI: ComponenteMIDTOV1 = new ComponenteMIDTOV1().deserialize(tmp);

        if (this.data.id) {
            ComponenteMI.id = this.data.id;
            ComponenteMI.fechaCreacion = this.data.fechaCreacion;
            ComponenteMI.usuarioCreacion = this.data.usuarioCreacion;
            ComponenteMI.fechaModificacion = new Date();
            ComponenteMI.usuarioModificacion = this.users.userSession.id;
            ComponenteMI.activo = this.estatusRecord;
            this.conponentMiService.updateComponentMi(ComponenteMI).subscribe(() => {
                // Alert.success('', 'Componente MI actualizado correctamente');
                this.basicNotification.notif("success",'Componente MI actualizado correctamente');
                this.ref.close(true);
            });
        } else {
            ComponenteMI.fechaCreacion = new Date();
            ComponenteMI.usuarioCreacion = this.users.userSession.id;
            this.conponentMiService.createComponentMi(ComponenteMI).subscribe(() => {
                // Alert.success('', 'Componente MI creado correctamente');
                this.basicNotification.notif("success",'Componente MI creado correctamente');
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

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    private trackingStatusForm(): void {
        this.subscription.add(this.conponentMiRecordForm.statusChanges.subscribe(() => (this.edit = true)));
    }

    private setPermissions(): void {
        this.permissions = this.thisAccess.getPermissions(
            this.users.userSession.modulos,
            this.users.userSession.vistas,
            this.router.url
        );
    }

    checkPermission(p: number): boolean {
        //todo: revisar seguridad
        return true;
        return this.permissions[p];
    }

    changeStatusDescription($event: any): void {
        const estatusRecord: boolean = $event.checked ;
        this.estatusRecord = estatusRecord;
        this.estatus = estatusRecord ? "Activo":"Inactivo";
        
    }
}
