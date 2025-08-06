import { LevelModalityService } from './../../../../../../core/services/api/level-modality/level-modality.service';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, Subscription } from 'rxjs';
import { CampusService, InstitutionService, RegionsService, UsersService } from 'src/app/core/services';
import { ValidatorService } from 'src/app/shared/validators';
import { Alert, clearForm } from 'src/app/utils/helpers';
import {
    CampusDTOV1,
    CatalogoUsuarioDTOV1,
    InstitucionDTOV1,
    NivelModalidadDTOV1,
    RegionDTOV1,
    TablePaginatorSearch,
    Vista,
} from 'src/app/utils/models';
import { CampusData } from './campus-record.service';
import { ModuleIdV2 } from 'src/app/utils/enums/modules-idV2';
import { Router } from '@angular/router';
import { ModulesCatalogDTO } from 'src/app/utils/models/modules-catalog.dto';
import { Console } from 'console';

import { takeUntil } from 'rxjs/operators';
import { BasicNotification } from 'src/app/utils/helpers/basicNotification';

export enum ModalTitle {
    NEW = 'Nuevo Campus',
    EDIT = 'Editar Campus',
}

@Component({
    selector: 'app-campus-record',
    templateUrl: './campus-record.component.html',
    styleUrls: ['./campus-record.component.scss'],
})
export class CampusRecordComponent implements OnInit, OnDestroy {
    campusRecordForm: FormGroup;
    title: ModalTitle;
    data: CampusDTOV1;
    edit: boolean;
    subscription: Subscription;
    disabled: boolean;
    permission: boolean;
    regionList: RegionDTOV1[];
    institucionList: InstitucionDTOV1[] = [];
    usuariosList: CatalogoUsuarioDTOV1[];
    levelModalityList: NivelModalidadDTOV1[];
    thisAccess: Vista;
    thisModule: ModulesCatalogDTO;
    permissions: boolean[];
    estatus: string;
    estatusRecord: boolean;
    protected _onDestroy = new Subject<void>();

    constructor(
        @Inject(MAT_DIALOG_DATA)
        public readonly campusData: CampusData,
        private router: Router,
        public readonly regionsService: RegionsService,
        public readonly levelModality: LevelModalityService,
        private readonly formBuilder: FormBuilder,
        private readonly campus: CampusService,
        private readonly ref: MatDialogRef<never>,
        private regions: RegionsService,
        private institution: InstitutionService,
        private users: UsersService,
        private readonly validator: ValidatorService,
        private basicNotification : BasicNotification
    ) {
        this.title = ModalTitle.NEW;
        this.data = new CampusDTOV1();
        this.edit = null;
        this.disabled = null;
        this.permission = null;
        this.regionList = [];
        this.levelModalityList = [];
        this.subscription = new Subscription();
        this.campusRecordForm = this.formBuilder.group({
            clave: [null, [Validators.required, Validators.maxLength(50), this.validator.noWhitespace]],
            nombre: [null, [Validators.required, Validators.maxLength(500), this.validator.noWhitespace]],
            institucionId: [null, [Validators.required]],
            regionId: [null, [Validators.required]],
            nivelesModalidad: [null, [Validators.required]],
            directorRegionalId: [null],
            activo: [true, []],
        });
        this.thisAccess = new Vista();
        this.permissions = [false, false, false];
    }

    ngOnInit() {
        // this.campusRecordForm.get('directorRegionalId').valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
        //     // this.filterList();
        //     console.log('value changes');
        // });

        this.campusRecordForm.get('directorRegionalId').disable();
        // this.campusRecordForm.get('directorRegionalId').valueChanges.subscribe((value) => {
        //     console.log('value changes=' + value.toString());
        // });

        this.setPermissions();
        this.disabled = !this.checkPermission(2);
        this.title = this.campusData ? ModalTitle.EDIT : ModalTitle.NEW;
        this.estatusRecord = this.campusData ? this.campusData.data.activo : true;
        this.estatus = this.campusData ? this.campusData.data.activo? "Activo":"Inactivo" : "Activo";

        this.getAllRegions();
        this.getAllInstitutions();
        this.getAllLevelModality();
        this.getAllUsers();
        if (this.campusData) {
            this.campus.getCampusById(this.campusData.data.id).subscribe((response) => {
                if (!response.output) {
                    return;
                }
                const data = new CampusDTOV1().deserialize(response.output[0]);
                this.data = data;
                //this.campusRecordForm.patchValue(data);
                this.campusRecordForm.get('institucionId').disable();
                this.campusRecordForm.get('clave').setValue(data.clave);
                this.campusRecordForm.get('nombre').setValue(data.nombre);
                this.campusRecordForm.get('institucionId').setValue(data.institucionId);
                //this.campusRecordForm.get('clave').setValue(data.clave);
                this.campusRecordForm.get('regionId').patchValue(data.regionId);
                //this.campusRecordForm.get('directorRegionalId').setValue(data.directorRegionalId);
                this.onRegionSeleccionada(data.regionId);
                this.campusRecordForm.get('activo').setValue(data.activo);

                const niveles = data.nivelesModalidadIds;
                // let nivelesIds: NivelModalidadDTOV1[] = [];
                // niveles.forEach((x) => {
                //     const levelModalidad = this.levelModalityList.find((level) => level.id == x);
                //     nivelesIds.push(levelModalidad);
                // });

                this.campusRecordForm.get('nivelesModalidad').patchValue(niveles);
                this.campusRecordForm.get('nivelesModalidad').updateValueAndValidity();

                // this.campusRecordForm.get('regionId').updateValueAndValidity();
                // this.campusRecordForm.get('clave').disable();
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
        this.campusRecordForm.markAllAsTouched();
        if (this.campusRecordForm.invalid) {
            // Alert.error('Verifique que los campos sean correctos');
            this.basicNotification.notif('error', 'Verifique que los campos sean correctos');
            return;
        }
        clearForm(this.campusRecordForm);
        const tmp = this.campusRecordForm.getRawValue();
        const campus: CampusDTOV1 = new CampusDTOV1().deserialize(tmp);
        const levelModalityList = this.levelModalityList.filter((item) => tmp.nivelesModalidad.includes(item.id));
        campus.nivelesModalidad = null;
        //campus.nivelModalidad = tmp.nivelesModalidad.toString();
        campus.nivelesModalidadIds = levelModalityList.map((e) => e.id);
        if (this.data.id) {
            //Update
            campus.id = this.data.id;
            campus.fechaCreacion = this.data.fechaCreacion;
            campus.usuarioCreacion = this.data.usuarioCreacion;
            campus.fechaModificacion = new Date();
            campus.usuarioModificacion = this.users.userSession.id;
            campus.activo = this.estatusRecord;
            this.campus.updateCampus(campus).subscribe(() => {
                // Alert.success('', 'Campus actualizado correctamente');
                this.basicNotification.notif('success', 'Campus actualizado correctamente');
                this.ref.close(true);
            });
        } else {
            //Insert
            campus.fechaCreacion = new Date();
            campus.usuarioCreacion = this.users.userSession.id;
            this.campus.createCampus(campus).subscribe(() => {
                // Alert.success('', 'Campus creado correctamente');
                this.basicNotification.notif('success', 'Campus creado correctamente');
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
            },
        );
    }

    private trackingStatusForm(): void {
        this.subscription.add(this.campusRecordForm.statusChanges.subscribe(() => (this.edit = true)));
    }

    private getAllRegions(): void {
        const filters = new TablePaginatorSearch();
        filters.filter = { activo: true };
        filters.pageSize = 100;
        this.regions.getAllRegions(filters).subscribe((response) => {
            if (response.output) {
                this.regionList = response.output.map((region) => new RegionDTOV1().deserialize(region));
            }
        });
    }

    private getAllInstitutions(): void {
        const filters = new TablePaginatorSearch();
        filters.filter = { activo: true };
        filters.pageSize = 100;
        this.institution.getAllInstitutions(filters).subscribe((response) => {
            if (response.output) {
                this.institucionList = response.output.map((region) => new InstitucionDTOV1().deserialize(region));
            }
        });
    }

    private getAllLevelModality(): void {
        const filters = new TablePaginatorSearch();
        filters.filter = { activo: true };
        filters.pageSize = 100;
        this.levelModality.getAllLevelModality(filters).subscribe((response) => {
            if (response.output) {
                this.levelModalityList = response.output.map((item) => new NivelModalidadDTOV1().deserialize(item));
            }
        });
    }

    private getAllUsers(): void {
        const filters = new TablePaginatorSearch();
        filters.pageSize = 999999;
        this.users.getAllUsers(filters).subscribe((response) => {
            if (response.output) {
                this.usuariosList = response.output.map((region) => new CatalogoUsuarioDTOV1().deserialize(region));
            }
        });
    }

    private setPermissions(): void {
        //TODO J031: Esperar que corrigan lo spermisos para habilitarlo
        // this.permissions = this.thisAccess.getPermissions(
        //     this.users.userSession.modulos,
        //     this.users.userSession.vistas,
        //     this.router.url,
        // );
        this.permissions = [true, true, true];
    }

    checkPermission(p: number): boolean {
        return this.permissions[p];
    }

    onRegionSeleccionada(selectedValue: number) {
        this.regionsService.getRegionById(selectedValue).subscribe((response) => {
            if (response.output) {
                let data = response.output.map((result) => new RegionDTOV1().deserialize(result))[0];
                this.campusRecordForm.get('directorRegionalId').patchValue(data.directorRegionalId);
                //this.nivelList = response.data.map((region) => new NivelDTO().deserialize(region));
            }
        });
    }

    changeStatusDescription($event: any): void {
        const estatusRecord: boolean = $event.checked ;
        this.estatusRecord = estatusRecord;
        this.estatus = estatusRecord ? "Activo":"Inactivo";
        
    }
}
