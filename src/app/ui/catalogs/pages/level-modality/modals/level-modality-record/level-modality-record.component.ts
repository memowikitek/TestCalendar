import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { LevelModalityService, RegionsService, UsersService } from 'src/app/core/services';
import { ValidatorService } from 'src/app/shared/validators';
import { Alert, clearForm } from 'src/app/utils/helpers';
import { ModalidadDTOV1, NivelDTOV1, NivelModalidadDTOV1, TablePaginatorSearch, Vista } from 'src/app/utils/models';
import { LevelModalityData } from './level-modality-record.service';
import { ModuleIdV2 } from 'src/app/utils/enums/modules-idV2';
import { Router } from '@angular/router';
import { ModulesCatalogDTO } from 'src/app/utils/models/modules-catalog.dto';
import { BasicNotification } from 'src/app/utils/helpers/basicNotification';

export enum ModalTitle {
    NEW = 'Nuevo Nivel / Modalidad',
    EDIT = 'Editar Nivel / Modalidad',
}

@Component({
    selector: 'app-level-modality',
    templateUrl: './level-modality-record.component.html',
    styleUrls: ['./level-modality-record.component.scss'],
    standalone: false
})
export class LevelModalityRecordComponent implements OnInit, OnDestroy {
    levelModalityRecordForm: FormGroup;
    title: ModalTitle;
    data: NivelModalidadDTOV1;
    edit: boolean;
    subscription: Subscription;
    disabled: boolean;
    permission: boolean;
    levelList: NivelDTOV1[];
    modalityList: ModalidadDTOV1[];
    thisAccess: Vista;
    thisModule: ModulesCatalogDTO;
    permissions: boolean[];
    estatusRecord: boolean;
    estatus: string;

    constructor(
        @Inject(MAT_DIALOG_DATA)
        public readonly levelModalityData: LevelModalityData,
        private router: Router,
        private readonly formBuilder: FormBuilder,
        private readonly levelModality: LevelModalityService,
        private readonly ref: MatDialogRef<never>,
        private users: UsersService,
        private readonly validator: ValidatorService,
        private basicNotification : BasicNotification,
    ) {
        this.title = ModalTitle.NEW;
        this.data = new NivelModalidadDTOV1();
        this.edit = null;
        this.disabled = null;
        this.permission = null;
        this.levelList = [];
        this.modalityList = [];
        this.subscription = new Subscription();
        this.levelModalityRecordForm = this.formBuilder.group({
            clave: [null, [Validators.required, Validators.maxLength(6), this.validator.noWhitespace]],
            descripcion: [null, [Validators.required]],
            activo: [true, []],
        });
        this.thisAccess = new Vista();
        this.permissions = [false, false, false];
        this.estatus = "Activo";
        this.estatusRecord = true;

    }

    ngOnInit() {
        //this.setPermissions();
        //this.disabled = !this.checkPermission(2);
        this.title = this.levelModalityData ? ModalTitle.EDIT : ModalTitle.NEW;
        this.estatusRecord = this.levelModalityData ? this.levelModalityData.data.activo : true;
        this.estatus = this.levelModalityData ? this.levelModalityData.data.activo? "Activo":"Inactivo" : "Activo";
            //this.getAllLevels();
     //   this.getAllModalities();
        if (this.levelModalityData) {
            this.levelModality.getLevelModalityById(this.levelModalityData.data.id).subscribe((response) => {
                if (!response.output) {
                    return;
                }
                console.log("NM "+response.output[0]);
                const data = new NivelModalidadDTOV1().deserialize(response.output[0]);
                this.data = data;
                this.levelModalityRecordForm.get('clave').disable();
                this.levelModalityRecordForm.patchValue(data);
                this.levelModalityRecordForm.get('clave').setValue(data.clave);
                //this.levelModalityRecordForm.get('descripcion').setValue(data.descripcion);
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
        this.levelModalityRecordForm.markAllAsTouched();
        if (this.levelModalityRecordForm.invalid) {
            // Alert.error('Verifique que los campos sean correctos');
            this.basicNotification.notif("error",'Verifique que los campos sean correctos');
            return;
        }
        clearForm(this.levelModalityRecordForm);
        const tmp = this.levelModalityRecordForm.getRawValue();
        const levelModality: NivelModalidadDTOV1 = new NivelModalidadDTOV1().deserialize(tmp);
        levelModality.modalidadId = parseInt(tmp.modalidad);
        levelModality.nivelId = parseInt(tmp.nivel);
        levelModality.modalidad = null;
        levelModality.nivel = null;
        levelModality.activo = this.estatusRecord;
        if (this.data.id) {
            levelModality.id = this.data.id;
            levelModality.fechaCreacion = this.data.fechaCreacion;
            levelModality.usuarioCreacion = this.data.usuarioCreacion;
            levelModality.fechaModificacion = new Date();
            levelModality.usuarioModificacion = this.users.userSession.id;
            this.levelModality.updateLevelModality(levelModality).subscribe(() => {
                // Alert.success('', 'Nivel/Modalidad actualizado correctamente');
                this.basicNotification.notif("success",'Nivel/Modalidad actualizado correctamente');
                this.ref.close(true);
            });
        } else {
            levelModality.fechaCreacion = new Date();
            levelModality.usuarioCreacion = this.users.userSession.id;
            this.levelModality.createLevelModality(levelModality).subscribe(() => {
                // Alert.success('', 'Nivel/Modalidad creado correctamente');
                this.basicNotification.notif("success",'Nivel/Modalidad creado correctamente');
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
        this.subscription.add(this.levelModalityRecordForm.statusChanges.subscribe(() => (this.edit = true)));
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

    private getAllLevels(): void {
        const filters = new TablePaginatorSearch();
        filters.pageNumber = 0;
        filters.pageSize = 1000;
        filters.filter = { activo: true };
        this.levelModality.getAllLevel(filters).subscribe((response) => {
            if (response.output) {
                this.levelList = response.output.map((region) => new NivelDTOV1().deserialize(region));
            }
        });
    }

    private getAllModalities(): void {
        const filters = new TablePaginatorSearch();
        filters.pageNumber = 0;
        filters.pageSize = 1000;
        filters.filter = { activo: true };
        this.levelModality.getAllModality(filters).subscribe((response) => {
            if (response.output) {
                this.modalityList = response.output.map((region) => new ModalidadDTOV1().deserialize(region));
            }
        });
    }

    changeStatusDescription($event: any): void {
        const estatusRecord: boolean = $event.checked ;
        this.estatusRecord = estatusRecord;
        this.estatus = estatusRecord ? "Activo":"Inactivo";
        
    }
}
