import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import {
    SubindicatorMiService,
    IndicatorMiService,
    ComponentMiService,
    UsersService,
    PilarEstrategicoMiService,
} from 'src/app/core/services';
import { ValidatorService } from 'src/app/shared/validators';
import { Alert, clearForm } from 'src/app/utils/helpers';
import {
    SubIndicadorMIDTOV1,
    IndicadorMIDTOV1,
    ComponenteMIDTOV1,
    Vista,
    PilarEstrategicoMIDTOV1,
    TablePaginatorSearch,
} from 'src/app/utils/models';
import { ModuleIdV2 } from 'src/app/utils/enums/modules-idV2';
import { Router } from '@angular/router';
import { ModulesCatalogDTO } from 'src/app/utils/models/modules-catalog.dto';
import { SubIndicatorMIData } from './sub-indicator-mi-record.service';
import { MatSelectChange } from '@angular/material/select';
import { BasicNotification } from 'src/app/utils/helpers/basicNotification';

export enum ModalTitle {
    NEW = 'Nuevo Subindicador MI',
    EDIT = 'Editar Subindicador MI',
}
@Component({
    selector: 'app-sub-indicator-mi-record',
    templateUrl: './sub-indicator-mi-record.component.html',
    styleUrls: ['./sub-indicator-mi-record.component.scss'],
})
export class SubIndicatorMiRecordComponent implements OnInit, OnDestroy {
    SubIndicatorMiRecordForm: FormGroup;
    title: ModalTitle;
    data: SubIndicadorMIDTOV1;
    indicadorMiList: IndicadorMIDTOV1[];
    pilarMiList: PilarEstrategicoMIDTOV1[];
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
        public readonly subIndicadorMiData: SubIndicatorMIData,
        private router: Router,
        private readonly formBuilder: FormBuilder,
        private readonly ref: MatDialogRef<never>,
        private readonly validator: ValidatorService,
        private readonly subindicatorMiService: SubindicatorMiService,
        private readonly indicatorMiService: IndicatorMiService,
        private readonly pilarMiService: PilarEstrategicoMiService,
        private readonly ComponentMiService: ComponentMiService,
        private users: UsersService,
        private basicNotification : BasicNotification,
    ) {
        this.subscription = new Subscription();
        this.title = ModalTitle.NEW;
        this.data = new SubIndicadorMIDTOV1();
        this.indicadorMiList = [];
        this.pilarMiList = [];
        this.componentMiList = [];
        this.edit = null;
        this.disabled = null;
        this.permission = null;
        this.SubIndicatorMiRecordForm = this.formBuilder.group({
            clave: [null, [Validators.required, Validators.maxLength(50), this.validator.noWhitespace]],
            nombre: [null, [Validators.required, Validators.maxLength(500), this.validator.noWhitespace]],
            indicadorMiId: [null, [Validators.required]],
            pilarEstrategicoMiId: [null, [Validators.required]],
            componenteMiId: [null, [Validators.required]],
            activo: [true, []],
        });
        this.thisAccess = new Vista();
        this.permissions = [false, false, false];
    }

    ngOnInit(): void {
        this.onGetAllStrategicPillarMi();
        this.getAllComponentesMi();
        this.onGetAllIndicatorMi();
         //todo: revisar seguridad
        // this.setPermissions();
        this.disabled = !this.checkPermission(2);
        this.title = this.subIndicadorMiData ? ModalTitle.EDIT : ModalTitle.NEW;
        this.estatusRecord = this.subIndicadorMiData ? this.subIndicadorMiData.data.activo : true;
        this.estatus = this.subIndicadorMiData ? this.subIndicadorMiData.data.activo? "Activo":"Inactivo" : "Activo";
        if (this.subIndicadorMiData) {
            this.subindicatorMiService.getSubIndicatorMiById(this.subIndicadorMiData.data.id).subscribe((response) => {
                if (!response.output) {
                    return;
                }
                const data = new SubIndicadorMIDTOV1().deserialize(response.output[0]);
                this.data = data;
                this.SubIndicatorMiRecordForm.patchValue(data);
                this.SubIndicatorMiRecordForm.get('pilarEstrategicoMiId').disable();
                this.SubIndicatorMiRecordForm.get('clave').disable();
                this.SubIndicatorMiRecordForm.get('indicadorMiId').disable();
                this.SubIndicatorMiRecordForm.get('componenteMiId').disable();
                this.SubIndicatorMiRecordForm.get('indicadorMiId').setValue(data.indicadorMi.id);
                this.SubIndicatorMiRecordForm.get('componenteMiId').setValue(data.indicadorMi.componenteMiid);
                this.SubIndicatorMiRecordForm.get('pilarEstrategicoMiId').setValue(
                    data.indicadorMi.pilarEstrategicoMiid
                );
                this.trackingStatusForm();
            });
        } else {
            this.SubIndicatorMiRecordForm.get('pilarEstrategicoMiId').disable();
            this.SubIndicatorMiRecordForm.get('componenteMiId').disable();
            this.trackingStatusForm();
        }
    }

    getAllComponentesMi(): void {
        this.pilarMiList = [];
        this.indicadorMiList = [];
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
    onGetAllStrategicPillarMi() {
        const filters = new TablePaginatorSearch();
        filters.pageSize = 1000;
        filters.pageNumber = 0;
        filters.filter = { activo: true };
        this.pilarMiService.getAllStrategicPillarMi(filters).subscribe((response) => {
            if (response.output) {
                this.pilarMiList = response.output.map((item) => new PilarEstrategicoMIDTOV1().deserialize(item));
            }
        });
    }

    onGetAllIndicatorMi() {
        const filters = new TablePaginatorSearch();
        filters.pageSize = 1000;
        filters.pageNumber = 0;
        filters.filter = { activo: true };
        this.indicatorMiService.getAllIndicatorMi(filters).subscribe((response) => {
            if (response.output) {
                this.indicadorMiList = response.output.map((item) => new IndicadorMIDTOV1().deserialize(item));
            }
        });
    }

    onIndicadorChange(event: MatSelectChange): void {
        this.SubIndicatorMiRecordForm.get('componenteMiId').patchValue(null);
        this.SubIndicatorMiRecordForm.get('pilarEstrategicoMiId').patchValue(null);
        if (event.value) {
            const filters = new TablePaginatorSearch();
            filters.pageSize = 1000;
            filters.pageNumber = 0;
            let indicador = this.indicadorMiList.find((item) => item.id == event.value);
            this.SubIndicatorMiRecordForm.get('componenteMiId').setValue(indicador.componenteMiid);
            this.SubIndicatorMiRecordForm.get('pilarEstrategicoMiId').setValue(indicador.pilarEstrategicoMiid);
            this.trackingStatusForm();
        }
    }

    onPilarChange(event: MatSelectChange): void {
        this.SubIndicatorMiRecordForm.get('indicadorMiId').patchValue(null);
        this.indicadorMiList = [];
        if (event.value) {
            const filters = new TablePaginatorSearch();
            filters.pageSize = 1000;
            filters.pageNumber = 0;
            let pilarEstrategicoMi = this.pilarMiList.find((item) => item.id == event.value);
            filters.filter = { activo: true, pilarEstrategicoMiId: pilarEstrategicoMi.id };
            this.indicatorMiService.getAllIndicatorMi(filters).subscribe((response) => {
                if (response.output && response.output.length > 0) {
                    this.indicadorMiList = response.output.map((item) => new IndicadorMIDTOV1().deserialize(item));
                    this.SubIndicatorMiRecordForm.get('indicadorMiId').enable();
                } else {
                    // Alert.error('No existen Indicadores MI para la selección');
                    this.basicNotification.notif("error",'No existen Indicadores MI para la selección');
                }
            });
        }
    }

    submit(): void {
        this.SubIndicatorMiRecordForm.markAllAsTouched();
        if (this.SubIndicatorMiRecordForm.invalid) {
            // Alert.error('Verifique que los campos sean correctos');
            this.basicNotification.notif("error",'Verifique que los campos sean correctos');
            return;
        }
        clearForm(this.SubIndicatorMiRecordForm);
        const tmp = this.SubIndicatorMiRecordForm.getRawValue();
        const subIndicadorMi: SubIndicadorMIDTOV1 = new SubIndicadorMIDTOV1().deserialize(tmp);
        if (this.data.id) {
            subIndicadorMi.id = this.data.id;
            subIndicadorMi.fechaCreacion = this.data.fechaCreacion;
            subIndicadorMi.usuarioCreacion = this.data.usuarioCreacion;
            subIndicadorMi.fechaModificacion = new Date();
            subIndicadorMi.usuarioModificacion = this.users.userSession.id;
            subIndicadorMi.activo = this.estatusRecord;
            this.subindicatorMiService.updateSubIndicatorMi(subIndicadorMi).subscribe(() => {
                // Alert.success('', 'Subindicador MI actualizado correctamente');
                this.basicNotification.notif("success",'Subindicador MI se actualizó correctamente');
                this.ref.close(true);
            });
        } else {
            subIndicadorMi.fechaCreacion = new Date();
            subIndicadorMi.usuarioCreacion = this.users.userSession.id;
            this.subindicatorMiService.createSubIndicatortMi(subIndicadorMi).subscribe(() => {
                // Alert.success('', 'Subindicador MI creado correctamente');
                this.basicNotification.notif("success",'Subindicador MI creado correctamente');
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
        this.subscription.add(this.SubIndicatorMiRecordForm.statusChanges.subscribe(() => (this.edit = true)));
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
