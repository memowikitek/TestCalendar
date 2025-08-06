import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { UsersService } from 'src/app/core/services';
import { CorporateAreaService } from 'src/app/core/services/api/coporate-area/corporate-area.service';
import { ValidatorService } from 'src/app/shared/validators';
import { Alert, clearForm } from 'src/app/utils/helpers';
import { AreaCorporativaDTO, AreaCorporativaDTOV1, TablePaginatorSearch, Vista } from 'src/app/utils/models';
import { CorporateAreaData } from './coporate-area-record.service';
import { CorporateSubAreaService } from 'src/app/core/services/api/corporate-subarea/corporate-subarea.service';
import { SubAreaCorporativaDTOV1 } from 'src/app/utils/models/subarea-corporativa.dto.v1';
import { Router } from '@angular/router';
import { ModulesCatalogDTO } from 'src/app/utils/models/modules-catalog.dto';
import { UpperCasePipe } from '@angular/common';
import { ThemePalette } from '@angular/material/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BasicNotification } from 'src/app/utils/helpers/basicNotification';

export enum ModalTitle {
    NEW = 'Nueva área central',
    EDIT = 'Editar área central',
}
@Component({
    templateUrl: './corporate-area-record.component.html',
    styleUrls: ['./corporate-area-record.component.scss'],
})
export class CorporateAreaRecordComponent implements OnInit, OnDestroy {
    corporateAreaRecordForm: FormGroup;
    title: ModalTitle;
    data: AreaCorporativaDTOV1;
    edit: boolean;
    subscription: Subscription;
    disabled: boolean;
    permission: boolean;
    removable: boolean;
    //subareascorporativaList: SubAreaCorporativaDTOV1[] = [];
    public separatorKeysCodes = [ENTER, COMMA];
    public corporateAreaSubAreasList: number[] = [];
    thisAccess: Vista;
    thisModule: ModulesCatalogDTO;
    permissions: boolean[];
    estatusRecord: boolean;
    estatus: string;
    color: ThemePalette = 'accent';

    constructor(
        @Inject(MAT_DIALOG_DATA)
        public readonly coporateAreaData: CorporateAreaData,
        private router: Router,
        private readonly formBuilder: FormBuilder,
        private readonly corporateArea: CorporateAreaService,
        private readonly ref: MatDialogRef<never>,
        private users: UsersService,
        private readonly validator: ValidatorService, //private readonly corporateSubArea: CorporateSubAreaService
        // private notification: NzNotificationService,
        private basicNotification : BasicNotification,
    ) {
        // this.corporateAreaSubAreasList = [];
        this.title = ModalTitle.NEW;
        this.data = new AreaCorporativaDTOV1();
        this.edit = null;
        this.estatus = "Inactivo";
        this.disabled = null;
        this.permission = null;
        this.subscription = new Subscription();
        this.removable = true;
        this.corporateAreaRecordForm = this.formBuilder.group({
            siglas: [null, [Validators.required, Validators.maxLength(5), this.validator.noWhitespace]],
            nombre: [null, [Validators.required, Validators.maxLength(150), this.validator.noWhitespace]],
            subareas_: [null, []],
            activo: [true, []],
        });
        this.thisAccess = new Vista();
        this.permissions = [false, false, false];
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    ngOnInit(): void {
        //todo: revisar seguridad
        // this.setPermissions();
        this.disabled = !this.checkPermission(2);
        this.title = this.coporateAreaData ? ModalTitle.EDIT : ModalTitle.NEW;
        this.estatusRecord = this.coporateAreaData ? this.coporateAreaData.data.activo : true;
        this.estatus = this.coporateAreaData ? this.coporateAreaData.data.activo? "Activo":"Inactivo" : "Activo";

        //this.getAllSubAreas();
        if (this.coporateAreaData) {
            this.corporateArea.getCoporateAreaById(this.coporateAreaData.data.id).subscribe((response) => {
                if (!response.output) {
                    return;
                }
                const data = new AreaCorporativaDTOV1().deserialize(response.output[0]);
                this.data = data;
                this.corporateAreaSubAreasList = [];
                // this.corporateAreaSubAreasList = this.data.areaCorporativaSubAreas;
                this.corporateAreaRecordForm.patchValue(data);
                this.corporateAreaRecordForm.get('siglas').disable();
                this.corporateAreaRecordForm.get('nombre').updateValueAndValidity();
                this.trackingStatusForm();
            });
        } else {
            this.trackingStatusForm();
        }
    }

    submit(): void {
        this.corporateAreaRecordForm.markAllAsTouched();
        if (this.corporateAreaRecordForm.invalid) {
            // Alert.error('Verifique que los campos sean correctos');
            this.basicNotification.notif("error",'Verifique que los campos sean correctos');
            return;
        }
        clearForm(this.corporateAreaRecordForm);
        const tmp = this.corporateAreaRecordForm.getRawValue();
        const areaCorporativa: AreaCorporativaDTOV1 = new AreaCorporativaDTOV1().deserialize(tmp);

        if (this.data.id) {
            areaCorporativa.id = this.data.id;
            areaCorporativa.fechaCreacion = this.data.fechaCreacion;
            areaCorporativa.usuarioCreacion = this.data.usuarioCreacion;
            areaCorporativa.fechaModificacion = new Date();
            areaCorporativa.usuarioModificacion = this.users.userSession.id;
            areaCorporativa.activo = this.estatusRecord;

            this.corporateArea.updateCorporateArea(areaCorporativa).subscribe(() => {
                // Alert.success('', 'Área Central actualizada correctamente');
                this.basicNotification.notif("success",'Área Central actualizada correctamente');
                this.ref.close(true);
            });
        } else {
            areaCorporativa.fechaCreacion = new Date();
            areaCorporativa.usuarioCreacion = this.users.userSession.id;
            this.corporateArea.createCorporateArea(areaCorporativa).subscribe(() => {
                // Alert.success('', 'Área Central creada correctamente');
                this.basicNotification.notif("success",'Área Central creada correctamente');
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

    changeStatusDescription($event: any): void {
        const estatusRecord: boolean = $event.checked ;
        this.estatusRecord = estatusRecord;
        this.estatus = estatusRecord ? "Activo":"Inactivo";
        
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
        this.subscription.add(this.corporateAreaRecordForm.statusChanges.subscribe(() => (this.edit = true)));
    }

    // private getAllSubAreas(): void {
    //     const filters = new TablePaginatorSearch();
    //     this.corporateSubArea.getAllCorporateSubAreas(filters).subscribe((response) => {
    //         if (response.output) {
    //             this.subareascorporativaList = response.output
    //                 .map((sub) => new SubAreaCorporativaDTOV1().deserialize(sub))
    //                 .filter((Y) => Y.activo == true);
    //         }
    //     });
    // }

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
}
