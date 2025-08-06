import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { InstitutionService, UsersService } from 'src/app/core/services';
import { ValidatorService } from 'src/app/shared/validators';
import { Alert, clearForm } from 'src/app/utils/helpers';
import { /*InstitutionDTO,*/ InstitucionDTOV1, TablePaginatorSearch, UsuarioDTOV1, Vista } from 'src/app/utils/models';
import { InstitutionData } from './institution-record.service';
import { ModuleIdV2 } from 'src/app/utils/enums/modules-idV2';
import { Router } from '@angular/router';
import { ModulesCatalogDTO } from 'src/app/utils/models/modules-catalog.dto';
import { BasicNotification } from 'src/app/utils/helpers/basicNotification';

export enum ModalTitle {
    NEW = 'Nueva institución',
    EDIT = 'Editar institución',
}

@Component({
    selector: 'app-institution-record',
    templateUrl: './institution-record.component.html',
    styleUrls: ['./institution-record.component.scss'],
    standalone: false
})
export class InstitutionRecordComponent implements OnInit, OnDestroy {
    institutionRecordForm: FormGroup;
    title: ModalTitle;
    data: InstitucionDTOV1;
    edit: boolean;
    subscription: Subscription;
    disabled: boolean;
    permission: boolean;
    usuariosList: UsuarioDTOV1[];
    thisAccess: Vista;
    thisModule: ModulesCatalogDTO;
    permissions: boolean[];
    estatus: string;
    estatusRecord: boolean;
    constructor(
        @Inject(MAT_DIALOG_DATA)
        public readonly institutionData: InstitutionData,
        private router: Router,
        private readonly formBuilder: FormBuilder,
        private readonly institutions: InstitutionService,
        private readonly ref: MatDialogRef<never>,
        private users: UsersService,
        private readonly validator: ValidatorService,
        private basicNotification : BasicNotification,
    ) {
        this.title = ModalTitle.NEW;
        this.data = new InstitucionDTOV1();
        this.edit = null;
        this.disabled = null;
        this.permission = null;
        this.subscription = new Subscription();
        this.institutionRecordForm = this.formBuilder.group({
            clave: [null, [Validators.required, Validators.maxLength(10), this.validator.noWhitespace]],
            nombre: [null, [Validators.required, Validators.maxLength(100), this.validator.noWhitespace]],
            activo: [true, []],
        });
        this.thisAccess = new Vista();
        this.permissions = [false, false, false];
    }

    ngOnInit() {
        //todo: revisar seguridad
        // this.setPermissions();
        this.disabled = !this.checkPermission(2);

        // this.getAllUsers();
        this.title = this.institutionData ? ModalTitle.EDIT : ModalTitle.NEW;
        this.estatusRecord = this.institutionData ? this.institutionData.data.activo : true;
        this.estatus = this.institutionData ? this.institutionData.data.activo? "Activo":"Inactivo" : "Activo";
        if (this.institutionData) {
            this.institutions.getInstitutionById(this.institutionData.data.id).subscribe((response) => {
                if (!response.output) {
                    return;
                }
                console.log(response);
                const data = new InstitucionDTOV1().deserialize(response.output[0]);
                this.data = data;
                this.institutionRecordForm.patchValue(data);
                this.trackingStatusForm();
            });
        } else {
            this.trackingStatusForm();
        }
    }

    // private getAllUsers(): void {
    //     const filters = new TablePaginatorSearch();
    //     filters.pageSize = -1;
    //     this.users.getAllUsers(filters).subscribe((response) => {
    //         if (response.output) {
    //             this.usuariosList = response.output.map((institution) => new UsuarioDTOV1().deserialize(institution));
    //         }
    //     });
    // }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    submit(): void {
        this.institutionRecordForm.markAllAsTouched();
        if (this.institutionRecordForm.invalid) {
            // Alert.error('Verifique que los campos sean correctos');
            this.basicNotification.notif("error",'Verifique que los campos sean correctos');
            return;
        }
        clearForm(this.institutionRecordForm);
        const tmp = this.institutionRecordForm.getRawValue();
        const institution: InstitucionDTOV1 = new InstitucionDTOV1().deserialize(tmp);
        if (this.data.id) {
            institution.id = this.data.id;
            institution.fechaCreacion = this.data.fechaCreacion;
            institution.usuarioCreacion = this.data.usuarioCreacion;
            institution.fechaModificacion = new Date();
            institution.usuarioModificacion = this.users.userSession.id;
            institution.activo=this.estatusRecord;
            this.institutions.updateInstitution(institution).subscribe(() => {
                // Alert.success('', 'Institución actualizada correctamente');
                this.basicNotification.notif("success",'Institución actualizada correctamente');
                this.ref.close(true);
            });
        } else {
            institution.fechaCreacion = new Date();
            institution.usuarioCreacion = this.users.userSession.id;
            this.institutions.createInstitution(institution).subscribe(() => {
                // Alert.success('', 'Institución creada correctamente');
                this.basicNotification.notif("success",'Institución creada correctamente');
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
                this.ref.close(result);
            }
        );
    }

    private trackingStatusForm(): void {
        this.subscription.add(this.institutionRecordForm.statusChanges.subscribe(() => (this.edit = true)));
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
