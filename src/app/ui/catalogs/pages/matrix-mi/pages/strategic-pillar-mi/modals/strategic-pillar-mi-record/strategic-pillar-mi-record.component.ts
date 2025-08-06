import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ComponentMiService, PilarEstrategicoMiService, UsersService } from 'src/app/core/services';
import { ValidatorService } from 'src/app/shared/validators';
import { Alert, clearForm } from 'src/app/utils/helpers';
import { ComponenteMIDTOV1, PilarEstrategicoMIDTOV1, TablePaginatorSearch, Vista } from 'src/app/utils/models';
import { ModuleIdV2 } from 'src/app/utils/enums/modules-idV2';
import { Router } from '@angular/router';
import { ModulesCatalogDTO } from 'src/app/utils/models/modules-catalog.dto';
import { PilarEstrategicoMIData } from './strategic-pillar-mi-record.service';
import { BasicNotification } from 'src/app/utils/helpers/basicNotification';

export enum ModalTitle {
    NEW = 'Nuevo Pilar Estratégico MI',
    EDIT = 'Editar Pilar Estratégico MI',
}

@Component({
    selector: 'app-strategic-pillar-mi-record',
    templateUrl: './strategic-pillar-mi-record.component.html',
    styleUrls: ['./strategic-pillar-mi-record.component.scss'],
})
export class PilarEstrategicoMiRecordComponent implements OnInit, OnDestroy {
    StrategicPillarMiRecordForm: FormGroup;
    title: ModalTitle;
    data: PilarEstrategicoMIDTOV1;
    componentMiList: ComponenteMIDTOV1[];
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
        public readonly StrategicPillarMiData: PilarEstrategicoMIData,
        private router: Router,
        private readonly formBuilder: FormBuilder,
        private readonly ref: MatDialogRef<never>,
        private readonly validator: ValidatorService,
        private readonly StrategicPillarMiService: PilarEstrategicoMiService,
        private readonly ComponentMiService: ComponentMiService,
        private readonly users: UsersService,
        private basicNotification : BasicNotification,
    ) {
        this.subscription = new Subscription();
        this.title = ModalTitle.NEW;
        this.data = new PilarEstrategicoMIDTOV1();
        this.edit = null;
        this.disabled = null;
        this.permission = null;
        this.StrategicPillarMiRecordForm = this.formBuilder.group({
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
        this.disabled = !this.checkPermission(2);
        this.title = this.StrategicPillarMiData ? ModalTitle.EDIT : ModalTitle.NEW;
        this.estatusRecord = this.StrategicPillarMiData ? this.StrategicPillarMiData.data.activo : true;
        this.estatus = this.StrategicPillarMiData ? this.StrategicPillarMiData.data.activo? "Activo":"Inactivo" : "Activo";
        this.getAllComponentesMi();
        if (this.StrategicPillarMiData) {
            this.StrategicPillarMiService.getStrategicPillarMiById(this.StrategicPillarMiData.data.id).subscribe(
                (response) => {
                    if (!response.output) {
                        return;
                    }
                    const data = new PilarEstrategicoMIDTOV1().deserialize(response.output[0]);
                    this.data = data;
                    this.StrategicPillarMiRecordForm.patchValue(data);
                    this.trackingStatusForm();
                }
            );
        } else {
            this.trackingStatusForm();
        }
    }

    getAllComponentesMi(): void {
        const filters = new TablePaginatorSearch();
        filters.pageSize = 1000;
        filters.pageNumber = 0;
        filters.filter = { activo: true };
        this.ComponentMiService.getAllComponentMi(filters).subscribe((response) => {
            if (response.output) {
                this.componentMiList = response.output.map((item) => new ComponenteMIDTOV1().deserialize(item));
            }
        });
    }

    submit(): void {
        this.StrategicPillarMiRecordForm.markAllAsTouched();
        if (this.StrategicPillarMiRecordForm.invalid) {
            // Alert.error('Verifique que los campos sean correctos');
            this.basicNotification.notif("error",'Verifique que los campos sean correctos');
            return;
        }
        clearForm(this.StrategicPillarMiRecordForm);
        const tmp = this.StrategicPillarMiRecordForm.getRawValue();
        const PilarEstrategicoMI: PilarEstrategicoMIDTOV1 = new PilarEstrategicoMIDTOV1().deserialize(tmp);
        if (this.data.id) {
            PilarEstrategicoMI.id = this.data.id;
            PilarEstrategicoMI.fechaCreacion = this.data.fechaCreacion;
            PilarEstrategicoMI.usuarioCreacion = this.data.usuarioCreacion;
            PilarEstrategicoMI.fechaModificacion = new Date();
            PilarEstrategicoMI.usuarioModificacion = this.users.userSession.id;
            PilarEstrategicoMI.activo = this.estatusRecord;
            this.StrategicPillarMiService.updateStrategicPillarMi(PilarEstrategicoMI).subscribe(() => {
                // Alert.success('', 'Pilar Estratégico actualizado correctamente');
                this.basicNotification.notif("success",'Pilar Estratégico actualizado correctamente');
                this.ref.close(true);
            });
        } else {
            PilarEstrategicoMI.fechaCreacion = new Date();
            PilarEstrategicoMI.usuarioCreacion = this.users.userSession.id;
            this.StrategicPillarMiService.createStrategicPillarMi(PilarEstrategicoMI).subscribe(() => {
                // Alert.success('', 'Pilar Estratégico creado correctamente');
                this.basicNotification.notif("success",'Pilar Estratégico creado correctamente');
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
        this.subscription.add(this.StrategicPillarMiRecordForm.statusChanges.subscribe(() => (this.edit = true)));
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
