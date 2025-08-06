import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { forkJoin, Observable, of, Subscription } from 'rxjs';
import {
    CampusService,
    CorporateAreaService,
    InstitutionService,
    LevelAttentionService,
    ResponsibilityAreasService,
    UsersService,
} from 'src/app/core/services';
import { ValidatorService } from 'src/app/shared/validators';
import { Alert, clearForm } from 'src/app/utils/helpers';
import {
    AreaCorporativaDTOV1,
    AreaResponsableDTOV1,
    CampusDTOV1,
    InstitucionDTOV1,
    NivelAtencionDTO,
    NivelModalidadDTOV1,
    TablePaginatorSearch,
    Vista,
} from 'src/app/utils/models';
import { AreaResponsableData } from './responsibility-areas-record.service';
import { DependencyAreaService } from 'src/app/core/services/api/dependency-area/dependency-area.service';
import { DependenciaAreaDTOV1 } from 'src/app/utils/models/dependencia-area.dto.v1';
import { ModuleIdV2 } from 'src/app/utils/enums/modules-idV2';
import { Router } from '@angular/router';
import { ModulesCatalogDTO } from 'src/app/utils/models/modules-catalog.dto';
import { BasicNotification } from '../../../../../../utils/helpers/basicNotification';
import { data } from 'autoprefixer';
import { catchError, map } from 'rxjs/operators';

export enum ModalTitle {
    NEW = 'Nueva área responsable',
    EDIT = 'Editar área responsable',
}

@Component({
    templateUrl: './responsibility-areas-record.component.html',
    styleUrls: ['./responsibility-areas-record.component.scss'],
})
export class ResponsibilityAreasRecordComponent implements OnInit, OnDestroy {
    title: ModalTitle;
    responsibilityForm: FormGroup;
    levelAttentionList: NivelAtencionDTO[];
    responsabilityAreaList: AreaResponsableDTOV1[];
    dependencyAreaList: DependenciaAreaDTOV1[];
    allDependencyAreaList: DependenciaAreaDTOV1[];
    corporateAreaList: AreaCorporativaDTOV1[];
    subscription: Subscription;
    data: AreaResponsableDTOV1;
    status: boolean;
    private duplicateValue: boolean;
    tempList: AreaResponsableDTOV1[];
    disabled: boolean;
    edit: boolean;
    isEdit: boolean = false;
    thisAccess: Vista;
    thisModule: ModulesCatalogDTO;
    permissions: boolean[];
    institucionList: InstitucionDTOV1[] = [];
    estatus: string;
    estatusRecord: boolean;
    selectedCampus: CampusDTOV1[] = [];
    campusList: CampusDTOV1[] = [];
    allCampusList: CampusDTOV1[] = [];

    constructor(
        @Inject(MAT_DIALOG_DATA) public readonly areaResponsableData: AreaResponsableData,
        private router: Router,
        private readonly ref: MatDialogRef<never>,
        private readonly matDialogRef: MatDialogRef<boolean>,
        private readonly formBuilder: FormBuilder,
        private readonly levelAttention: LevelAttentionService,
        private readonly responsibilityAreas: ResponsibilityAreasService,
        private readonly validator: ValidatorService,
        private readonly dependencyArea: DependencyAreaService,
        private readonly corporateArea: CorporateAreaService,
        private users: UsersService,
        private institution: InstitutionService,
        private readonly campus: CampusService,
        private basicNotification: BasicNotification
    ) {
        this.title = ModalTitle.NEW;
        this.data = new AreaResponsableDTOV1();
        this.levelAttentionList = [];
        this.tempList = [];
        this.responsabilityAreaList = [];
        this.subscription = new Subscription();
        this.status = false;
        this.duplicateValue = false;
        this.responsibilityForm = this.formBuilder.group({
            clave: [null, [Validators.required, Validators.maxLength(10), this.validator.noWhitespace]],
            nombre: [null, [Validators.required, Validators.maxLength(150), this.validator.noWhitespace]],
            institucionId: [null, [Validators.required]],
            campuses: [null, [Validators.required]],
            areaPadre: [null, [Validators.required]],
            //consolidacion: [false, []],
            activo: [true, []],
        });
        this.permissions = [false, false, false];
        this.disabled = null;
        this.edit = null;
    }

    ngOnInit(): void {
        this.setPermissions();
        this.disabled = !this.checkPermission(2);
        this.title = this.areaResponsableData ? ModalTitle.EDIT : ModalTitle.NEW;
        forkJoin([this.getAllCampus(), this.getAllDependencyAreas(), this.getAllInstitutions()]).subscribe(() => {
            // Este código se ejecutará cuando todas las solicitudes hayan sido completadas
            console.log('Load');
            if (this.areaResponsableData) {
                this.isEdit = true;
                this.responsibilityForm.get('institucionId').disable();
                this.responsibilityAreas
                    .getDependenciaAreaById(this.areaResponsableData.data.id)
                    .subscribe((response) => {
                        if (!response.data) {
                            return;
                        }
                        this.data = new AreaResponsableDTOV1().deserialize(response.data);
                        this.estatus = this.data.activo ? 'Activo' : 'Inactivo';
                        //console.log(this.data, this.levelModalityList);
                        this.responsibilityForm.patchValue(this.data);
                        //this.responsibilityForm.get('consolidacion').setValue(this.data.consolidacion);
                        this.responsibilityForm.get('areaPadre').setValue(this.data.dependenciaAreaId);
                        this.onInstitucionChange(this.data.institucionId, false);
                        this.trackingStatusForm();
                    });
            } else {
                this.isEdit = false;
                this.estatus = 'Activo';
                this.trackingStatusForm();
            }
        });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    submit(): void {
        if (this.duplicateValue) {
            Alert.error('', 'El nombre y la dependencia no deben ser iguales.');
            this.responsibilityForm.setErrors({ nombre: true });
            return;
        }
        this.responsibilityForm.markAllAsTouched();
        if (this.responsibilityForm.invalid) {
            Alert.error('Verifique que los campos sean correctos');
            return;
        }
        clearForm(this.responsibilityForm);
        const tmp = this.responsibilityForm.getRawValue();
        const areaResponsable: AreaResponsableDTOV1 = new AreaResponsableDTOV1().deserialize(tmp);
        if (this.data.id) {
            areaResponsable.id = this.data.id;
            areaResponsable.fechaModificacion = new Date();
            areaResponsable.usuarioModificacion = this.users.userSession.id;
            //areaResponsable.areaPadre = tmp.areaPadre!=0?tmp.areaPadre:null;
            //console.log('areaResponsable',areaResponsable);
            this.responsibilityAreas.updateResponsibilityArea(areaResponsable).subscribe(() => {
                this.basicNotification.notif('success', 'Área responsable actualizada correctamente');
                this.ref.close(true);
            });
        } else {
            areaResponsable.fechaCreacion = new Date();
            areaResponsable.usuarioCreacion = this.users.userSession.id;
            this.responsibilityAreas.createResponsibilityArea(areaResponsable).subscribe(() => {
                this.basicNotification.notif('success', 'Área responsable creada correctamente');
                this.ref.close(true);
            });
        }
    }

    closeModalByConfimation(): void {
        if (!this.status) {
            this.matDialogRef.close();
            return;
        }
        Alert.confirm('Alerta', '¿Está seguro de que desea salir? Los datos ingresados no serán guardados.').subscribe(
            (result) => {
                if (!result || !result.isConfirmed) {
                    return;
                }
                this.matDialogRef.close();
            }
        );
    }

    onCampusChange(event: MatSelectChange): void {
        let val = event.value;//console.log('Event.value',val);
        if(val.length<=this.campusList.length){
            if(val[0] === 0){
                val.splice(0, 1);
                this.responsibilityForm.controls.campuses.patchValue(val);
            }//console.log(val);
        }
        this.selectedCampus = [];
        this.selectedCampus = event.value.map((item: CampusDTOV1) => new CampusDTOV1().deserialize(item));
        //console.log('Resultado',this.selectedCampus);
    }

    onInstitucionChange(institucionId: number, clearData: boolean = true): void {
        if (clearData) {
            this.selectedCampus = [];
            this.responsibilityForm.get('campuses').patchValue(null);
            this.responsibilityForm.get('areaPadre').patchValue(null);
        }

        this.campusList = this.allCampusList.filter(
            (campus) => campus.activo === true && campus.institucionId == institucionId
        );

        this.dependencyAreaList = this.allDependencyAreaList.filter(
            (item) => item.activo === true && item.institucionId == institucionId
        );
    }

    checkRepeatedName($event: MatSelectChange) {
        const newname: string = this.responsibilityForm.controls['nombre'].value;
    }

    private getAllLevelAttention(): void {
        const filter = new TablePaginatorSearch();
        filter.filter = { activo: true };
        filter.pageSize = 100;
        this.levelAttention.getAllLevelAttention(filter).subscribe((response) => {
            if (response.data.data) {
                const data: NivelAtencionDTO[] = response.data.data.map((area) =>
                    new NivelAtencionDTO().deserialize(area)
                );
                this.levelAttentionList = data.filter((item) => item.activo === true);
            }
        });
    }

    setSituationValidate($event: MatSelectChange) {
        const newname = this.responsibilityForm.controls['nombre'].value;
        const levelModalityList: AreaResponsableDTOV1 = this.responsabilityAreaList.find((i) => $event.value == i.id);
        if (levelModalityList != undefined) {
            if (levelModalityList.nombre == newname) {
                this.duplicateValue = true;
            } else {
                this.duplicateValue = false;
            }
        } else this.duplicateValue = false;
    }

    private getAllResponsabilitysAreas(): void {
        const filter: TablePaginatorSearch = new TablePaginatorSearch();
        filter.filter = { activo: true };
        filter.pageSize = 1000;
        this.responsibilityAreas.getAllResponsibilityAreas(filter).subscribe((response) => {
            if (response.output) {
                const data: AreaResponsableDTOV1[] = response.output.map((areaResponsable) =>
                    new AreaResponsableDTOV1().deserialize(areaResponsable)
                );
                this.responsabilityAreaList = data;
            }
        });
    }

    private getAllInstitutions(): Observable<any> {
        const filters = new TablePaginatorSearch();
        filters.filter = { activo: true };
        filters.pageSize = 100;
        return this.institution.getAllInstitutions(filters).pipe(
            map((response) => {
                if (response.output) {
                    this.institucionList = response.output.map((region) => new InstitucionDTOV1().deserialize(region));
                }
            }),
            catchError((error) => {
                console.error('Error en getAllInstitutions:', error);
                return of(null); // Manejo de errores
            })
        );
    }

    private getAllCampus(): Observable<any> {
        const filters = new TablePaginatorSearch();
        filters.pageSize = 999999;
        return this.campus.getAllCampus(filters).pipe(
            map((response) => {
                if (response.isSuccess) {
                    this.allCampusList = response.data;
                }
            }),
            catchError((error) => {
                console.error('Error en getAllCampus:', error);
                return of(null); // Manejo de errores
            })
        );
    }

    private getAllDependencyAreas(): Observable<any> {
        const filter: TablePaginatorSearch = new TablePaginatorSearch();
        filter.filter = { activo: true };
        filter.pageSize = 1000;
        return this.dependencyArea.getAllDependenciaAreas(filter).pipe(
            map((response) => {
                if (response.data) {
                    const data: DependenciaAreaDTOV1[] = response.data.map((areaResponsable) =>
                        new DependenciaAreaDTOV1().deserialize(areaResponsable)
                    );
                    this.allDependencyAreaList = data;
                }
            }),
            catchError((error) => {
                console.error('Error en getAllDependencyAreas:', error);
                return of(null); // Manejo de errores
            })
        );
    }

    private trackingStatusForm(): void {
        this.subscription.add(this.responsibilityForm.statusChanges.subscribe(() => (this.edit = true)));
    }

    private setPermissions(): void {
        this.thisAccess = new Vista();
        //TODO J031: Esperar que corrigan lo spermisos para habilitarlo
        // this.permissions = this.thisAccess.getPermissions(
        //     this.users.userSession.modulos,
        //     this.users.userSession.vistas,
        //     this.router.url
        // );
        this.permissions = [true, true, true];
    }

    checkPermission(p: number): boolean {
        return this.permissions[p];
    }

    changeStatusDescription($event: any): void {
        const estatusRecord: boolean = $event.checked;
        this.estatusRecord = estatusRecord;
        this.estatus = estatusRecord ? 'Activo' : 'Inactivo';
    }

    toggleAllSelection() {
        const allSelected = this.responsibilityForm.controls.campuses.value.length === this.campusList.length; //console.log(this.responsibilityForm.controls.campuses.value.length,this.campusList.length,allSelected);
        this.responsibilityForm.controls.campuses.patchValue(allSelected ? [] : [0,...this.campusList.map(item => item.id)]); //console.log([0,...this.campusList.map(item => item.id)]);
    }
    
}
