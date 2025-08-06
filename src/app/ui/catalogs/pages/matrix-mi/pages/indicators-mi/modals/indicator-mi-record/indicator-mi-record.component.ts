import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription, from } from 'rxjs';
import {
    IndicatorService,
    IndicatorMiService,
    ComponentMiService,
    UsersService,
    PilarEstrategicoMiService,
} from 'src/app/core/services';
import { ValidatorService } from 'src/app/shared/validators';
//import { IndicatorData } from 'src/app/ui/configurations/pages/indicators/modals/indicator-record/indicator-record.service';
import { Alert, clearForm } from 'src/app/utils/helpers';
import {
    IndicadorMIDTOV1,
    ComponenteMIDTOV1,
    Vista,
    PilarEstrategicoMIDTOV1,
    TablePaginatorSearch,
} from 'src/app/utils/models';
import { IndicatorMIData } from './indicator-mi-record.service';
import { ModuleIdV2 } from 'src/app/utils/enums/modules-idV2';
import { Router } from '@angular/router';
import { ModulesCatalogDTO } from 'src/app/utils/models/modules-catalog.dto';
import { MatSelectChange } from '@angular/material/select';
import { BasicNotification } from 'src/app/utils/helpers/basicNotification';

export enum ModalTitle {
    NEW = 'Nuevo Indicador MI',
    EDIT = 'Editar Indicador MI',
}
@Component({
    selector: 'app-indicator-mi-record',
    templateUrl: './indicator-mi-record.component.html',
    styleUrls: ['./indicator-mi-record.component.scss'],
})
export class IndicatorMiRecordComponent implements OnInit, OnDestroy {
    indicatorMiRecordForm: FormGroup;
    title: ModalTitle;
    data: IndicadorMIDTOV1;
    pilarMiList: PilarEstrategicoMIDTOV1[];
    componentMiList: ComponenteMIDTOV1[];
    edit: boolean;
    subscription: Subscription;
    disabled: boolean;
    valorCbo: number;
    permission: boolean;
    thisAccess: Vista;
    thisModule: ModulesCatalogDTO;
    permissions: boolean[];
    estatus: string;
    estatusRecord: boolean;
    constructor(
        @Inject(MAT_DIALOG_DATA)
        public readonly indicatorData: IndicatorMIData,
        private router: Router,
        private readonly formBuilder: FormBuilder,
        private readonly ref: MatDialogRef<never>,
        private readonly validator: ValidatorService,
        private readonly IndicatorMiService: IndicatorMiService,
        private readonly ComponentMiService: ComponentMiService,
        private readonly pilarMiService: PilarEstrategicoMiService,
        private readonly users: UsersService,
        private basicNotification : BasicNotification,
    ) {
        this.subscription = new Subscription();
        this.title = ModalTitle.NEW;
        this.data = new IndicadorMIDTOV1();
        this.pilarMiList = [];
        this.componentMiList = [];
        this.edit = null;
        this.disabled = null;
        this.permission = null;
        this.indicatorMiRecordForm = this.formBuilder.group({
            clave: [null, [Validators.required, Validators.maxLength(10), this.validator.noWhitespace]],
            nombre: [null, [Validators.required, Validators.maxLength(150), this.validator.noWhitespace]],
            descripcion: [null, [Validators.required, Validators.maxLength(500), this.validator.noWhitespace]],
            componenteMiId: [null, [Validators.required]],
            pilarEstrategicoMiId: [null, [Validators.required]],
            activo: [true, []],
        });
        this.thisAccess = new Vista();
        this.permissions = [false, false, false];
    }

    ngOnInit(): void {
        //todo: revisar seguridad
        // this.setPermissions();
        this.disabled = !this.checkPermission(2);
        this.title = this.indicatorData ? ModalTitle.EDIT : ModalTitle.NEW;
        this.estatusRecord = this.indicatorData ? this.indicatorData.data.activo : true;
        this.estatus = this.indicatorData ? this.indicatorData.data.activo? "Activo":"Inactivo" : "Activo";
        this.getAllComponentesMi();
        this.getAllPilares();
        if (this.indicatorData) {
            this.IndicatorMiService.getIndicatorMiById(this.indicatorData.data.id).subscribe((response) => {
                if (!response.output) {
                    return;
                }
                const data = new IndicadorMIDTOV1().deserialize(response.output[0]);
                this.data = data;
                this.indicatorMiRecordForm.patchValue(data);
                this.indicatorMiRecordForm.get('clave').disable();
                this.indicatorMiRecordForm.get('componenteMiId').disable();
                this.indicatorMiRecordForm.get('pilarEstrategicoMiId').disable();
                this.indicatorMiRecordForm.get('componenteMiId').setValue(data.componenteMi.id);
                this.indicatorMiRecordForm.get('pilarEstrategicoMiId').setValue(data.pilarEstrategicoMi.id);
                this.trackingStatusForm();
            });
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

    getAllPilares(): void {
        const filters = new TablePaginatorSearch();
        filters.pageSize = 1000;
        filters.pageNumber = 0;
        filters.filter = { activo: true };
        this.pilarMiService.getAllStrategicPillarMi(filters).subscribe((response) => {
            if (response.output && response.output.length > 0) {
                this.pilarMiList = response.output.map((item) => new PilarEstrategicoMIDTOV1().deserialize(item));
            } else {
                // Alert.error('No existen Pilares Estratégicos MI para la selección');
                this.basicNotification.notif("error",'No existen Pilares Estratégicos MI para la selección');
            return;
            }
        });
    }

    submit(): void {
        this.indicatorMiRecordForm.markAllAsTouched();
        if (this.indicatorMiRecordForm.invalid) {
            // Alert.error('Verifique que los campos sean correctos');
            this.basicNotification.notif("error",'Verifique que los campos sean correctos');
            return;
        }
        const tmp = this.indicatorMiRecordForm.getRawValue();
        const indicadorMi: IndicadorMIDTOV1 = new IndicadorMIDTOV1().deserialize(tmp);
        console.log(indicadorMi);
        if (this.data.id) {
            indicadorMi.id = this.data.id;
            //indicadorMi.componenteMiid = this.indicatorMiRecordForm.get('componenteMiId').value;
            indicadorMi.usuarioCreacion = this.data.usuarioCreacion;
            indicadorMi.fechaModificacion = new Date();
            indicadorMi.usuarioModificacion = this.users.userSession.id;
            indicadorMi.activo = this.estatusRecord;
            this.IndicatorMiService.updateIndicatorMi(indicadorMi).subscribe(() => {
                // Alert.success('', 'Indicador MI actualizado correctamente');
                this.basicNotification.notif("success",'Indicador MI actualizado correctamente');
                this.ref.close(true);
            });
        } else {
            //indicadorMi.componenteMiid = this.indicatorMiRecordForm.get('componenteMiId').value;
            indicadorMi.fechaCreacion = new Date();
            indicadorMi.usuarioCreacion = this.users.userSession.id;
            this.IndicatorMiService.createIndicatorMi(indicadorMi).subscribe(() => {
                // Alert.success('', 'Indicador MI creado correctamente');
                this.basicNotification.notif("success",'Indicador MI creado correctamente');
                this.ref.close(true);
            });
        }
        clearForm(this.indicatorMiRecordForm);
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
        this.subscription.add(this.indicatorMiRecordForm.statusChanges.subscribe(() => (this.edit = true)));
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
