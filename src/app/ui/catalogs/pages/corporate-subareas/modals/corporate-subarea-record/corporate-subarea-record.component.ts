import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//import { MatChipInputEvent } from '@angular/material/chips/public-api';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { UsersService } from 'src/app/core/services';
import { CorporateAreaService } from 'src/app/core/services/api/coporate-area/corporate-area.service';
import { ValidatorService } from 'src/app/shared/validators';
import { Alert, clearForm } from 'src/app/utils/helpers';
import { AreaCorporativaDTO, AreaCorporativaDTOV1, TablePaginatorSearch, Vista } from 'src/app/utils/models';
import { CorporateSubAreaData } from './corporate-subarea-record.service';
import { SubAreaCorporativaDTOV1 } from 'src/app/utils/models/subarea-corporativa.dto.v1';
import { CorporateSubAreaService } from 'src/app/core/services/api/corporate-subarea/corporate-subarea.service';
import { Router } from '@angular/router';
import { ModulesCatalogDTO } from 'src/app/utils/models/modules-catalog.dto';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BasicNotification } from 'src/app/utils/helpers/basicNotification';

export enum ModalTitle {
    NEW = 'Nueva Subárea Central',
    EDIT = 'Editar Subárea Central',
}
@Component({
    templateUrl: './corporate-subarea-record.component.html',
    styleUrls: ['./corporate-subarea-record.component.scss'],
    standalone: false
})
export class CorporateSubAreaRecordComponent implements OnInit, OnDestroy {
    corporateSubAreaRecordForm: FormGroup;
    title: ModalTitle;
    data: SubAreaCorporativaDTOV1;
    areaCorporativaList: AreaCorporativaDTOV1[];
    edit: boolean;
    subscription: Subscription;
    disabled: boolean;
    permission: boolean;
    removable: boolean;
    public separatorKeysCodes = [ENTER, COMMA];
    thisAccess: Vista;
    thisModule: ModulesCatalogDTO;
    permissions: boolean[];
    estatusRecord: boolean;
    estatus: string;

    constructor(
        @Inject(MAT_DIALOG_DATA)
        public readonly coporateAreaData: CorporateSubAreaData,
        private router: Router,
        private readonly formBuilder: FormBuilder,
        private readonly corporateSubArea: CorporateSubAreaService,
        private readonly corporateArea: CorporateAreaService,
        private readonly ref: MatDialogRef<never>,
        private users: UsersService,
        private readonly validator: ValidatorService,
        private basicNotification: BasicNotification,
    ) {
        // this.corporateAreaSubAreasList = [];
        this.title = ModalTitle.NEW;
        this.data = new SubAreaCorporativaDTOV1();
        this.edit = null;
        this.estatus = "Inactivo";
        this.disabled = null;
        this.permission = null;
        this.subscription = new Subscription();
        this.removable = true;
        this.corporateSubAreaRecordForm = this.formBuilder.group({
            siglas: [null, [Validators.required, Validators.maxLength(5), this.validator.noWhitespace]],
            nombre: [null, [Validators.required, Validators.maxLength(150), this.validator.noWhitespace]],
            areaCentralId: [null, [Validators.required]],
            activo: [true, []],
        });
        this.areaCorporativaList = [];
        this.thisAccess = new Vista();
        this.permissions = [false, false, false];
    }
    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    ngOnInit(): void {
        //this.setPermissions();
        //this.disabled = !this.checkPermission(2);
        this.getAllArasCorporativas();
        this.title = this.coporateAreaData ? ModalTitle.EDIT : ModalTitle.NEW;
        this.estatusRecord = this.coporateAreaData ? this.coporateAreaData.data.activo : true;
        this.estatus = this.coporateAreaData ? this.coporateAreaData.data.activo? "Activo":"Inactivo" : "Activo";

        if (this.coporateAreaData) {
            this.corporateSubArea.getCoporateSubAreaById(this.coporateAreaData.data.id).subscribe((response) => {
                if (!response.output) {
                    return;
                }
                const data = new SubAreaCorporativaDTOV1().deserialize(response.output[0]);
                this.data = data;
                this.corporateSubAreaRecordForm.patchValue(data);
                this.corporateSubAreaRecordForm.get('siglas').disable();
                this.corporateSubAreaRecordForm.get('areaCentralId').disable();
                this.corporateSubAreaRecordForm.get('nombre').updateValueAndValidity();
                //this.corporateSubAreaRecordForm.get('areaCorporativaId').updateValueAndValidity();
                this.trackingStatusForm();
            });
        } else {
            this.trackingStatusForm();
        }
    }

    changeStatusDescription($event: any): void {
        const estatusRecord: boolean = $event.checked ;
        this.estatusRecord = estatusRecord;
        this.estatus = estatusRecord ? "Activo":"Inactivo";
        
    }

    private getAllArasCorporativas(): void {
        const filters = new TablePaginatorSearch();
        filters.filter = { activo: true };
        filters.pageSize = 999999;
        this.corporateArea.getAllCorporateAreas(filters).subscribe((response) => {
            if (response.output) {
                this.areaCorporativaList = response.output.map((region) =>
                    new AreaCorporativaDTOV1().deserialize(region)
                );
            }
        });
    }

    submit(): void {
        this.corporateSubAreaRecordForm.markAllAsTouched();
        if (this.corporateSubAreaRecordForm.invalid) {
            // Alert.error('Verifique que los campos sean correctos');
            this.basicNotification.notif("error",'Verifique que los campos sean correctos');
            return;
        }
        clearForm(this.corporateSubAreaRecordForm);
        const tmp = this.corporateSubAreaRecordForm.getRawValue();
        console.log(tmp);
        const subAreaCorporativa: SubAreaCorporativaDTOV1 = new SubAreaCorporativaDTOV1().deserialize(tmp);
        if (this.data.id) {
            subAreaCorporativa.id = this.data.id;
            subAreaCorporativa.fechaCreacion = this.data.fechaCreacion;
            subAreaCorporativa.usuarioCreacion = this.data.usuarioCreacion;
            subAreaCorporativa.fechaModificacion = new Date();
            subAreaCorporativa.usuarioModificacion = this.users.userSession.id;
            subAreaCorporativa.activo = this.estatusRecord;
            this.corporateSubArea.updateCorporateSubArea(subAreaCorporativa).subscribe(() => {
                // Alert.success('', 'Subárea central actualizada correctamente');
                this.basicNotification.notif("success",'Subárea central actualizada correctamente');
                this.ref.close(true);
            });
        } else {
            subAreaCorporativa.fechaCreacion = new Date();
            subAreaCorporativa.usuarioCreacion = this.users.userSession.id;
            this.corporateSubArea.createCorporateSubArea(subAreaCorporativa).subscribe(() => {
                // Alert.success('', 'Subárea central creada correctamente');
                this.basicNotification.notif("success",'Subárea central creada correctamente');
                this.ref.close(true);
            });
        }
    }

    // createBasicNotification(types: string, msj: string): void {

    //     this.notification.create(
    //         types,
    //         '',
    //         msj,
    //         { 
    //           nzDuration: 2000,
    //           nzStyle: {
    //             top: '40px',
    //             right: '-24px',
    //             width: '480px',
    //             padding: '8px 12px',
    //             //background: this.typeArray[0][type].background
    //           },
    //           nzClass: 'noti-'+types
    //         }
    //       )
    
    //   }

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
        this.subscription.add(this.corporateSubAreaRecordForm.statusChanges.subscribe(() => (this.edit = true)));
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
