import { Component, OnInit, Inject, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { Router } from '@angular/router';
import { error } from 'console';
import { Subscription } from 'rxjs';
import {
    EvaluationElementService,
    CyclesServiceV1,
    ResponsibilityAreasService,
    LevelModalityService,
    UsersService,
    GeneralConfigurationService,
} from 'src/app/core/services';
import { ValidatorService } from 'src/app/shared/validators';
import { Alert, clearForm } from 'src/app/utils/helpers';
import {
    PeriodoEvaluacionDTOV1,
    ElementoEvaluacionAnio,
    ElementoEvaluacionCycle,
    ElementoEvaluacionInstitution,
    AreaResponsableDTOV1,
    NivelModalidadDTOV1,
    CatalogoElementoEvaluacionDTOV1,
    ComponenteDTOV1,
    AreaCorporativaDTOV1,
    RegistroElementoEvaluacionArchivoDTO,
    TablePaginatorSearch,
    ConfNivelAreaResponsableDTO,
    TipoArea,
    Vista,
    ConfigGeneralDTO,
    InstitucionDTOV1,
} from 'src/app/utils/models';
import { ModulesCatalogDTO } from 'src/app/utils/models/modules-catalog.dto';

export enum ModalTitle {
    NEW = 'Nueva Configuración',
    EDIT = 'Editar Configuración',
}

@Component({
    selector: 'app-config-general',
    templateUrl: './config-general.component.html',
    styleUrls: ['./config-general.component.scss'],
})
export class ConfigGeneralComponent implements OnInit {
    @Input() initConfig = false;
    @Input() configGeneralData = new ConfigGeneralDTO();
    @Output() hideMainConfig = new EventEmitter<boolean>();

    filteredProccessList: PeriodoEvaluacionDTOV1[] = [];
    proccessList: PeriodoEvaluacionDTOV1[];
    periodoEvaluacion: PeriodoEvaluacionDTOV1;

    generalConfigRecordForm: FormGroup;
    selectedItemsControl: FormControl = new FormControl('', Validators.required);
    selectedYear: string;
    title: ModalTitle;
    data: ConfNivelAreaResponsableDTO;
    yearList: ElementoEvaluacionAnio[];
    cycleList: ElementoEvaluacionCycle[];
    institutionList: ElementoEvaluacionInstitution[];
    responsibilityAreaList: AreaResponsableDTOV1[];
    levelModalityList: NivelModalidadDTOV1[];
    areaLevelModalityList: NivelModalidadDTOV1[];
    areaLevelModalitySelected: NivelModalidadDTOV1[];
    evaluationElementCatalogList: CatalogoElementoEvaluacionDTOV1[];
    componentList: ComponenteDTOV1[];
    corporateAreaList: AreaCorporativaDTOV1[];
    subAreaCorporateList: { id: string | number; nombre: string }[];

    thisModule: ModulesCatalogDTO;
    edit: boolean;
    subscription: Subscription;
    disabled: boolean;
    disabledEdit: boolean;
    permission: boolean;
    thisAccess: Vista;
    permissions: boolean[];
    generica: boolean;
    dataSource: RegistroElementoEvaluacionArchivoDTO[];
    dataOriginal: ConfigGeneralDTO;

    constructor(
        private router: Router,
        private users: UsersService,
        private readonly generalConfiguration: GeneralConfigurationService,
        public readonly evaluationElement: EvaluationElementService,
        private readonly validator: ValidatorService,
        public readonly cycles: CyclesServiceV1,
        public readonly responsibilityAreasService: ResponsibilityAreasService,
        public readonly levelModalityService: LevelModalityService,
        private readonly formBuilder: FormBuilder
    ) {
        this.title = ModalTitle.NEW;
        this.data = new ConfNivelAreaResponsableDTO();
        this.periodoEvaluacion = new PeriodoEvaluacionDTOV1();
        this.dataOriginal = new ConfigGeneralDTO();

        this.institutionList = [];
        this.yearList = [];
        this.cycleList = [];
        this.proccessList = [];
        this.responsibilityAreaList = [];
        this.levelModalityList = [];
        this.areaLevelModalityList = [];
        this.areaLevelModalitySelected = [];
        this.evaluationElementCatalogList = [];
        this.componentList = [];
        this.corporateAreaList = [];
        this.subAreaCorporateList = [];
        this.edit = false;
        this.disabled = true;
        this.disabledEdit = false;
        this.permission = true;
        this.generica = true;
        this.subscription = new Subscription();
        this.selectedYear = '1990';
        this.generalConfigRecordForm = this.formBuilder.group({
            procesoId: [null, [Validators.required]],
            anio: [null, [Validators.required]],
            cicloId: [null, [Validators.required]],
            institucionId: [null, [Validators.required]],
            periodoEvaluacionId: [null],
            areaResponsableId: [null, [Validators.required]],
            tipoArea: [null],
            nivelModalidadId: [null, [Validators.required]],
            activo: [true],
        });
        this.thisAccess = new Vista();
        this.permissions = [false, false, false];
    }

    ngOnInit(): void {
        this.initConfig = true;
    }

    tabInit(record: ConfNivelAreaResponsableDTO): void {
        this.getProccess();
        this.getAllResponsibilityAreas();
        this.getAllLevelModality();

        this.selectedYear = '1990';
        this.title = record ? ModalTitle.EDIT : ModalTitle.NEW;
        this.setPermissions();
        this.areaLevelModalityList = [];
        this.areaLevelModalitySelected = [];

        this.disabled = !this.checkPermission(this.title === ModalTitle.EDIT ? 2 : 0);
        this.generalConfigRecordForm.reset();
        if (record) {
            const configComponentes = record.configComponentes;
            // set table data
            this.dataOriginal = new ConfigGeneralDTO();
            this.dataOriginal.id = record.id;
            this.dataOriginal.periodoEvaluacionId = record.periodoEvaluacionId;
            this.dataOriginal.areaResponsableId = record.areaResponsableId;
            this.dataOriginal.nivelModalidadId = record.nivelModalidadId;
            this.dataOriginal.activo = record.activo;
            this.dataOriginal.fechaCreacion = record.fechaCreacion;
            this.dataOriginal.usuarioCreacion = record.usuarioCreacion;
            this.dataOriginal.fechaModificacion = record.fechaModificacion;
            this.dataOriginal.usuarioModificacion = record.usuarioModificacion;
            this.dataOriginal.nivelesModalidad = record.nivelesModalidad;
            // set form data
            this.data = new ConfNivelAreaResponsableDTO().deserialize(record);
            this.data.activo = record.activo;
            this.periodoEvaluacion = new PeriodoEvaluacionDTOV1().deserialize(record.periodoEvaluacion);

            this.data.anio = this.periodoEvaluacion.anio;
            this.data.cicloId = this.periodoEvaluacion.cicloId;
            this.data.configuracionGeneralId = record.id;
            this.data.id = record.id;

            let areaResponsable = new AreaResponsableDTOV1().deserialize(record.areaResponsable);
            this.data.areaResponsableNombre = areaResponsable.nombre;
            this.data.generica = areaResponsable.tipoArea == TipoArea.Comun;
            this.generica = areaResponsable.tipoArea == TipoArea.Comun;
            this.data.areaResponsable = areaResponsable;

            //let institucion = new InstitucionDTOV1().deserialize(record.periodoEvaluacion.institucion);
            this.data.institucion = record.periodoEvaluacion.institucion;
            this.data.institucionId = record.periodoEvaluacion.institucionId;
            this.data.nivelesModalidad = record.nivelesModalidad;

            this.disabledEdit = false;
            this.generalConfigRecordForm.reset();
            if (record.configComponentes.length > 0) {
                this.disabledEdit = true;
                this.generalConfigRecordForm.get('procesoId').disable();
                this.generalConfigRecordForm.get('anio').disable();
                this.generalConfigRecordForm.get('cicloId').disable();
                this.generalConfigRecordForm.get('institucionId').disable();
                this.generalConfigRecordForm.get('areaResponsableId').disable();
            }

            this.generalConfigRecordForm.get('procesoId').setValue(this.data.periodoEvaluacionId, { emitEvent: false });
            this.generalConfigRecordForm.get('periodoEvaluacionId').setValue(this.data.periodoEvaluacionId);
            this.generalConfigRecordForm.get('anio').setValue(this.data.anio);
            this.generalConfigRecordForm.get('cicloId').setValue(this.data.cicloId);
            this.generalConfigRecordForm.get('institucionId').setValue(this.data.institucion);
            this.generalConfigRecordForm
                .get('areaResponsableId')
                .setValue(this.data.areaResponsableId, { emitEvent: false });
            this.generalConfigRecordForm.get('tipoArea').setValue(areaResponsable.getTypeAreaStr());

            this.getResponsibilityAreaById(record.nivelesModalidad, areaResponsable.id);

            this.generalConfigRecordForm.updateValueAndValidity();
        } else {
            this.dataOriginal = new ConfigGeneralDTO();
            this.data = record;
            this.generalConfigRecordForm.patchValue(this.data);
            this.generalConfigRecordForm.get('procesoId').enable();
            this.generalConfigRecordForm.get('areaResponsableId').disable();
            this.disabledEdit = false;
        }
        this.generalConfigRecordForm.get('anio').disable();
        this.generalConfigRecordForm.get('cicloId').disable();
        this.generalConfigRecordForm.get('institucionId').disable();
        this.trackingStatusForm();
    }

    submit(): void {
        this.generalConfigRecordForm.markAllAsTouched();
        if (this.generalConfigRecordForm.invalid) {
            Alert.error('Verifique que los campos sean correctos');
            return;
        }
        clearForm(this.generalConfigRecordForm);
        const tmp = this.generalConfigRecordForm.getRawValue();
        const configGeneral: ConfigGeneralDTO = new ConfigGeneralDTO().deserialize(tmp);
        const areaResponsable = this.responsibilityAreaList.find((item) => item.id == tmp.areaResponsableId);
        if (areaResponsable.tipoArea === TipoArea.Comun) {
            let nivelModalidad: number[] = [];
            this.areaLevelModalitySelected.forEach((item) => {
                nivelModalidad.push(item.id);
            });
            this.dataOriginal.nivelesModalidad = nivelModalidad.toString();
        } else {
            this.dataOriginal.nivelesModalidad = tmp.nivelModalidadId.toString();
        }
        if (this.dataOriginal.id) {
            // Update
            this.dataOriginal.periodoEvaluacionId = tmp.procesoId;
            this.dataOriginal.areaResponsableId = tmp.areaResponsableId;
            this.dataOriginal.activo = configGeneral.activo;
            this.dataOriginal.fechaModificacion = new Date();
            this.dataOriginal.usuarioModificacion = this.users.userSession.id;
            this.generalConfiguration.updateGeneralConfiguration(this.dataOriginal).subscribe((response) => {
                if (response.exito) {
                    Alert.success(
                        '',
                        response.mensaje ? response.mensaje : 'Configuración General actualizada correctamente'
                    );
                } else {
                    Alert.warn('', response.mensaje);
                }
                this.generalConfigRecordForm.reset();
                this.hideMainConfig.emit(true);
            });
        } else {
            // Create
            this.dataOriginal.periodoEvaluacionId = tmp.procesoId;
            this.dataOriginal.areaResponsableId = tmp.areaResponsableId;
            this.dataOriginal.activo = true;
            this.dataOriginal.fechaCreacion = new Date();
            this.dataOriginal.usuarioCreacion = this.users.userSession.id;
            let nivelModalidad = tmp.nivelModalidadId.toString().split(',');
            if (tmp.tipoArea === TipoArea.Comun) {
                nivelModalidad = [];
                this.areaLevelModalitySelected.forEach((item) => {
                    nivelModalidad.push(item.id);
                });
            }
            this.dataOriginal.nivelesModalidad = nivelModalidad.filter((item: string) => item !== '').toString();
            this.generalConfiguration.createGeneralConfiguration(this.dataOriginal).subscribe((response) => {
                if (!response.exito) {
                    Alert.success('', response.mensaje);
                } else {
                    this.generalConfigRecordForm.reset();
                    Alert.success('', 'Configuración General creada');
                }
                this.hideMainConfig.emit(true);
            });
        }
    }

    closeModalByConfimation(): void {
        if (!this.edit) {
            this.hideMainConfig.emit(true);
            this.generalConfigRecordForm.reset();
            return;
        }
        if (!this.generalConfigRecordForm.invalid) {
            Alert.confirm(
                'Alerta',
                '¿Está seguro de que desea salir? Los datos ingresados no serán guardados.'
            ).subscribe((result) => {
                if (!result || !result.isConfirmed) {
                    return;
                }
                this.hideMainConfig.emit(true);
                this.generalConfigRecordForm.reset();
            });
        } else {
            this.hideMainConfig.emit(true);
            this.generalConfigRecordForm.reset();
        }
    }

    onYearChange(event: MatSelectChange): void {
        // console.log('onYearChange');
        this.generalConfigRecordForm.get('cicloId').setValue(null);
        this.generalConfigRecordForm.get('institucionId').setValue(null);
        this.generalConfigRecordForm.get('procesoId').setValue(null);
        this.getCycles(event.value);
    }

    onCycleChange(anio: number, event: MatSelectChange): void {
        // console.log('onCycleChange');
        this.generalConfigRecordForm.get('institucionId').setValue(null);
        this.generalConfigRecordForm.get('procesoId').setValue(null);
        this.getInstitutions(anio, event.value);
    }

    onInstitutionChange(anio: string | number, cycle: string | number, event: MatSelectChange): void {
        // console.log('onInstitutionChange');
        this.generalConfigRecordForm.get('procesoId').setValue(null);
    }

    onProccessChange(event: MatSelectChange): void {
        this.periodoEvaluacion = event.value;
        let selectValue = this.proccessList.filter((o) => o.id === event.value)[0];
        this.generalConfigRecordForm.get('periodoEvaluacionId').patchValue(selectValue);
        this.generalConfigRecordForm.get('anio').patchValue(selectValue.anio);
        this.generalConfigRecordForm.get('cicloId').patchValue(selectValue.cicloId);
        this.generalConfigRecordForm.get('institucionId').patchValue(selectValue.institucion);
        this.generalConfigRecordForm.get('areaResponsableId').enable();
    }

    onResponsibilityAreaChange(event: MatSelectChange): void {
        this.getResponsibilityAreaById(null, event.value);
    }

    getSelectedNivelModalidad(item: NivelModalidadDTOV1) {
        if (item) {
            let selected = this.areaLevelModalitySelected.filter((i) => i.id === item.id);
            if (selected.length > 0) return true;
        }
        return false;
    }

    private getCycles(anio?: number): void {
        this.cycleList = [];
        this.institutionList = [];
        this.proccessList = [];
        const filters = new TablePaginatorSearch();
        filters.filter = { anio: anio, activo: true };
        filters.pageSize = 1000;
        filters.pageNumber = 0;
        this.evaluationElement.getCycles(filters).subscribe((response) => {
            if (response.output) {
                this.cycleList = response.output.map((item) => new ElementoEvaluacionCycle().deserialize(item));
            }
        });
    }

    private getInstitutions(anio?: number, cycle?: number): void {
        this.institutionList = [];
        this.proccessList = [];
        const filters = new TablePaginatorSearch();
        filters.filter = { anio: anio, cicloId: cycle, activo: true };
        filters.pageSize = 1000;
        filters.pageNumber = 0;
        this.evaluationElement.getInstitutions(filters).subscribe((response) => {
            if (response.output) {
                this.institutionList = response.output.map((item) =>
                    new ElementoEvaluacionInstitution().deserialize(item)
                );
            }
        });
    }

    private getProccess(): void {
        this.proccessList = [];
        const filters = new TablePaginatorSearch();
        filters.filter = { activo: true };
        this.evaluationElement.getProccess(filters).subscribe((response) => {
            if (response.output) {
                this.proccessList = response.output.map((item) => new PeriodoEvaluacionDTOV1().deserialize(item));
            }
        });
    }

    private getAllResponsibilityAreas(): void {
        const filters = new TablePaginatorSearch();
        filters.pageSize = 1000;
        filters.pageNumber = 0;
        filters.filter = { activo: true };
        this.responsibilityAreasService.getAllResponsibilityAreas(filters).subscribe((response) => {
            if (response.output) {
                this.responsibilityAreaList = response.output.map((item) =>
                    new AreaResponsableDTOV1().deserialize(item)
                );
            }
        });
    }

    private getAllLevelModality(): void {
        const filters: TablePaginatorSearch = new TablePaginatorSearch();
        filters.pageSize = 1000;
        filters.pageNumber = 0;
        filters.filter = { activo: true };
        this.levelModalityService.getAllLevelModality(filters).subscribe((response) => {
            if (response.output) {
                const data: NivelModalidadDTOV1[] = response.output.map((nivelModalidad) =>
                    new NivelModalidadDTOV1().deserialize(nivelModalidad)
                );
                this.levelModalityList = data;
            }
        });
    }

    private getResponsibilityAreaById(nivelesModalidad: string, responsibilityAreaId?: string | number): void {
        this.generalConfigRecordForm.get('nivelModalidadId').patchValue(null);
        this.areaLevelModalityList = [];
        if (responsibilityAreaId) {
            this.responsibilityAreasService.getResponsibilityAreaById(responsibilityAreaId).subscribe((response) => {
                if (response.output) {
                    const data = new AreaResponsableDTOV1().deserialize(response.output);
                    this.generalConfigRecordForm.get('tipoArea').patchValue(data.getTypeAreaStr());
                    this.generica = data.tipoArea == TipoArea.Comun;
                    const niveles = data.nivelModalidad.split(' - ');
                    if (niveles.length > 0 && data.nivelModalidad != '') {
                        niveles.forEach((x) => {
                            const levelModalidad = this.levelModalityList.find(
                                (level) => level.clave.trim() == x.trim()
                            );
                            this.areaLevelModalityList.push(levelModalidad);
                        });
                    } else {
                        Alert.error('El Area Responsable no tiene Niveles / Modalidad');
                    }
                    if (this.generica) {
                        this.areaLevelModalitySelected = this.areaLevelModalityList;
                        this.generalConfigRecordForm.get('nivelModalidadId').disable();
                    } else {
                        this.areaLevelModalitySelected = [];
                        if (nivelesModalidad) {
                            let levels = nivelesModalidad.trim().split(' - ');
                            let nivelModalidad = this.levelModalityList.filter((level) =>
                                levels.includes(level.clave.trim())
                            );
                            this.areaLevelModalitySelected = nivelModalidad;
                        }
                        if (!this.disabledEdit) this.generalConfigRecordForm.get('nivelModalidadId').enable();
                        else this.generalConfigRecordForm.get('nivelModalidadId').disable();
                    }
                }
            });
        }
    }

    private trackingStatusForm(): void {
        this.subscription.add(this.generalConfigRecordForm.statusChanges.subscribe(() => (this.edit = true)));
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
