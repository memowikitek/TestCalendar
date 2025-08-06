import { Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { Subscription } from 'rxjs';
import {
    CyclesService,
    CyclesServiceV1,
    EvaluationPeriodService,
    InstitutionService,
    UsersService,
} from 'src/app/core/services';
import { ValidatorService } from 'src/app/shared/validators';
import { Alert, clearForm, DateHelper, YearHelp } from 'src/app/utils/helpers';
import {
    Anio,
    CicloV1,
    InstitucionDTOV1,
    PeriodoEvaluacionDTOV1,
    PeriodoEvaluacionAddUpdateDTOV1,
    PeriodoEvaluacionEtapaAddUpdateDTOV1,
    TablePaginatorSearch,
    Vista,
} from 'src/app/utils/models';
import { EvaluationPeriodData } from './evaluation-period-record.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { ModuleIdV2 } from 'src/app/utils/enums/modules-idV2';
import { ProgressService } from 'src/app/core/modules/progress';
import { ModulesCatalogDTO } from 'src/app/utils/models/modules-catalog.dto';
import { Router } from '@angular/router';

export enum ModalTitle {
    NEW = 'Nuevo Periodo de Evaluación',
    EDIT = 'Editar Periodo de Evaluación',
}
@Component({
    templateUrl: './evaluation-period-record.component.html',
    styleUrls: ['./evaluation-period-record.component.scss'],
})
export class EvaluationPeriodRecordComponent implements OnInit, OnDestroy {
    evaluationPeriodRecordForm: FormGroup;
    title: ModalTitle;
    data: PeriodoEvaluacionDTOV1;
    edit: boolean;
    subscription: Subscription;
    disabled: boolean;
    permission: boolean;
    cycleList: CicloV1[];
    institutionList: InstitucionDTOV1[];
    yearList: Anio[];
    today: Date;
    thisAccess: Vista;
    thisModule: ModulesCatalogDTO;
    permissions: boolean[];
    @ViewChild('fInicialMeta') fInicialMeta!: ElementRef;
    @ViewChild('fFinMeta') fFinMeta!: ElementRef;
    @ViewChild('fInicialResultados') fInicialResultados!: ElementRef;
    @ViewChild('fFinResultados') fFinResultados!: ElementRef;
    @ViewChild('fInicialAutoevaluacion') fInicialAutoevaluacion!: ElementRef;
    @ViewChild('fFinAutoevaluacion') fFinAutoevaluacion!: ElementRef;
    @ViewChild('fInicialRevision') fInicialRevision!: ElementRef;
    @ViewChild('fFinRevision') fFinRevision!: ElementRef;
    @ViewChild('fInicialEvidencia') fInicialEvidencia!: ElementRef;
    @ViewChild('fFinalEvidencia') fFinalEvidencia!: ElementRef;
    @ViewChild('fInicialMejora') fInicialMejora!: ElementRef;
    @ViewChild('fFinPlanMejora') fFinPlanMejora!: ElementRef;
    @ViewChild('fInicialAuditoria') fInicialAuditoria!: ElementRef;
    @ViewChild('fFinAuditoria') fFinAuditoria!: ElementRef;

    constructor(
        @Inject(MAT_DIALOG_DATA)
        public readonly evaluationPeriodData: EvaluationPeriodData,
        private router: Router,
        public readonly cycles: CyclesServiceV1,
        private readonly formBuilder: FormBuilder,
        private readonly evaluationPeriod: EvaluationPeriodService,
        private readonly ref: MatDialogRef<never>,
        private users: UsersService,
        private institutions: InstitutionService,
        private readonly validator: ValidatorService
    ) {
        this.today = new Date();
        this.title = ModalTitle.NEW;
        this.data = new PeriodoEvaluacionDTOV1();
        this.edit = null;
        this.disabled = null;
        this.permission = null;
        this.cycleList = [];
        this.institutionList = [];
        this.yearList = [];
        this.subscription = new Subscription();
        this.evaluationPeriodRecordForm = this.formBuilder.group({
            idInstitucion: [null, [Validators.required, this.validator.noWhitespace]],
            anio: [null, [Validators.required, this.validator.noWhitespace]],
            idCiclo: [null, [Validators.required, this.validator.noWhitespace]],
            proceso: [{ value: null, disabled: true }],

            fechaInicialMeta: [{ value: null, disabled: true }, [Validators.required, this.validator.noWhitespace]],
            fechaFinMeta: [{ value: null, disabled: true }, [Validators.required, this.validator.noWhitespace]],
            fechaInicialCapturaResultados: [
                { value: null, disabled: true },
                [Validators.required, this.validator.noWhitespace],
            ],
            fechaFinCapturaResultados: [
                { value: null, disabled: true },
                [Validators.required, this.validator.noWhitespace],
            ],
            fechaInicialAutoEvaluacion: [
                { value: null, disabled: true },
                [Validators.required, this.validator.noWhitespace],
            ],
            fechaFinAutoEvaluacion: [
                { value: null, disabled: true },
                [Validators.required, this.validator.noWhitespace],
            ],
            fechaInicialRevision: [{ value: null, disabled: true }, [Validators.required, this.validator.noWhitespace]],
            fechaFinRevision: [{ value: null, disabled: true }, [Validators.required, this.validator.noWhitespace]],
            fechaInicialCargaEvidencia: [
                { value: null, disabled: true },
                [Validators.required, this.validator.noWhitespace],
            ],
            fechaFinCargaEvidencia: [
                { value: null, disabled: true },
                [Validators.required, this.validator.noWhitespace],
            ],
            fechaInicialPlanMejora: [
                { value: null, disabled: true },
                [Validators.required, this.validator.noWhitespace],
            ],
            fechaFinPlanMejora: [{ value: null, disabled: true }, [Validators.required, this.validator.noWhitespace]],
            fechaInicialAuditoria: [
                { value: null, disabled: true },
                [Validators.required, this.validator.noWhitespace],
            ],
            fechaFinAuditoria: [{ value: null, disabled: true }, [Validators.required, this.validator.noWhitespace]],
            activo: [true, []],
        });
        this.thisAccess = new Vista();
        this.permissions = [false, false, false];
    }

    ngOnInit(): void {
        this.setPermissions();
        this.disabled = !this.checkPermission(2);
        this.title = this.evaluationPeriodData ? ModalTitle.EDIT : ModalTitle.NEW;
        this.getAllCycles();
        this.getAllInstitution();
        this.yearList = YearHelp.getListAnio();
        if (this.evaluationPeriodData) {
            this.evaluationPeriod.getPeriodEvaluationById(this.evaluationPeriodData.data.id).subscribe((response) => {
                if (!response.output) {
                    return;
                }
                const data: PeriodoEvaluacionDTOV1 = new PeriodoEvaluacionDTOV1().deserialize(response.output);
                this.data = data;
                this.evaluationPeriodRecordForm.patchValue(data);
                this.evaluationPeriodRecordForm.get('proceso').patchValue(data.getProccessString());
                this.evaluationPeriodRecordForm.get('idCiclo').patchValue(data.cicloId);
                this.evaluationPeriodRecordForm.get('idInstitucion').patchValue(data.institucionId);

                const etapa = this.data.periodoEvaluacionEtapas.filter((i) => i.etapaId == 1);
                this.data.periodoEvaluacionEtapas.forEach((item) => {
                    if (item.etapaId == 1) {
                        this.evaluationPeriodRecordForm.get('fechaInicialMeta').patchValue(item.fechaInicio);
                        this.evaluationPeriodRecordForm.get('fechaFinMeta').patchValue(item.fechaFin);
                    }
                    if (item.etapaId == 2) {
                        this.evaluationPeriodRecordForm
                            .get('fechaInicialCapturaResultados')
                            .patchValue(item.fechaInicio);
                        this.evaluationPeriodRecordForm.get('fechaFinCapturaResultados').patchValue(item.fechaFin);
                    }
                    if (item.etapaId == 3) {
                        this.evaluationPeriodRecordForm.get('fechaInicialAutoEvaluacion').patchValue(item.fechaInicio);
                        this.evaluationPeriodRecordForm.get('fechaFinAutoEvaluacion').patchValue(item.fechaFin);
                    }
                    if (item.etapaId == 4) {
                        this.evaluationPeriodRecordForm.get('fechaInicialRevision').patchValue(item.fechaInicio);
                        this.evaluationPeriodRecordForm.get('fechaFinRevision').patchValue(item.fechaFin);
                    }
                    if (item.etapaId == 5) {
                        this.evaluationPeriodRecordForm.get('fechaInicialCargaEvidencia').patchValue(item.fechaInicio);
                        this.evaluationPeriodRecordForm.get('fechaFinCargaEvidencia').patchValue(item.fechaFin);
                    }
                    if (item.etapaId == 6) {
                        this.evaluationPeriodRecordForm.get('fechaInicialPlanMejora').patchValue(item.fechaInicio);
                        this.evaluationPeriodRecordForm.get('fechaFinPlanMejora').patchValue(item.fechaFin);
                    }
                    if (item.etapaId == 7) {
                        this.evaluationPeriodRecordForm.get('fechaInicialAuditoria').patchValue(item.fechaInicio);
                        this.evaluationPeriodRecordForm.get('fechaFinAuditoria').patchValue(item.fechaFin);
                    }
                });
                this.evaluationPeriodRecordForm.updateValueAndValidity();
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
        this.evaluationPeriodRecordForm.markAllAsTouched();
        if (this.evaluationPeriodRecordForm.invalid) {
            Alert.error('Verifique que los campos sean correctos');
            return;
        }
        //clearForm(this.evaluationPeriodRecordForm);
        const tmp = this.evaluationPeriodRecordForm.getRawValue();
        const periodoEvaluacion: PeriodoEvaluacionAddUpdateDTOV1 = new PeriodoEvaluacionAddUpdateDTOV1();
        periodoEvaluacion.anio = this.evaluationPeriodRecordForm.get('anio').value;
        periodoEvaluacion.cicloId = this.evaluationPeriodRecordForm.get('idCiclo').value;
        periodoEvaluacion.institucionId = this.evaluationPeriodRecordForm.get('idInstitucion').value;
        periodoEvaluacion.id = this.data.id;
        periodoEvaluacion.activo = this.evaluationPeriodRecordForm.get('activo').value;
        let etapa: PeriodoEvaluacionEtapaAddUpdateDTOV1 = new PeriodoEvaluacionEtapaAddUpdateDTOV1();

        etapa.periodoEvaluacionId = periodoEvaluacion.id;

        etapa.etapaId = 1;
        etapa.fechaInicio = this.evaluationPeriodRecordForm.get('fechaInicialMeta').value;
        etapa.fechaFin = this.evaluationPeriodRecordForm.get('fechaFinMeta').value;
        periodoEvaluacion.periodoEvaluacionEtapas.push(new PeriodoEvaluacionEtapaAddUpdateDTOV1().deserialize(etapa));

        etapa.etapaId = 2;
        etapa.fechaInicio = this.evaluationPeriodRecordForm.get('fechaInicialCapturaResultados').value;
        etapa.fechaFin = this.evaluationPeriodRecordForm.get('fechaFinCapturaResultados').value;
        periodoEvaluacion.periodoEvaluacionEtapas.push(new PeriodoEvaluacionEtapaAddUpdateDTOV1().deserialize(etapa));

        etapa.etapaId = 3;
        etapa.fechaInicio = this.evaluationPeriodRecordForm.get('fechaInicialAutoEvaluacion').value;
        etapa.fechaFin = this.evaluationPeriodRecordForm.get('fechaFinAutoEvaluacion').value;
        periodoEvaluacion.periodoEvaluacionEtapas.push(new PeriodoEvaluacionEtapaAddUpdateDTOV1().deserialize(etapa));

        etapa.etapaId = 4;
        etapa.fechaInicio = this.evaluationPeriodRecordForm.get('fechaInicialRevision').value;
        etapa.fechaFin = this.evaluationPeriodRecordForm.get('fechaFinRevision').value;
        periodoEvaluacion.periodoEvaluacionEtapas.push(new PeriodoEvaluacionEtapaAddUpdateDTOV1().deserialize(etapa));

        etapa.etapaId = 5;
        etapa.fechaInicio = this.stringToDate(this.fInicialEvidencia.nativeElement.value);
        etapa.fechaFin = this.stringToDate(this.fFinalEvidencia.nativeElement.value);
        periodoEvaluacion.periodoEvaluacionEtapas.push(new PeriodoEvaluacionEtapaAddUpdateDTOV1().deserialize(etapa));

        etapa.etapaId = 6;
        etapa.fechaInicio = this.evaluationPeriodRecordForm.get('fechaInicialPlanMejora').value;
        etapa.fechaFin = this.evaluationPeriodRecordForm.get('fechaFinPlanMejora').value;
        periodoEvaluacion.periodoEvaluacionEtapas.push(new PeriodoEvaluacionEtapaAddUpdateDTOV1().deserialize(etapa));

        etapa.etapaId = 7;
        etapa.fechaInicio = this.stringToDate(this.fInicialAuditoria.nativeElement.value);
        etapa.fechaFin = this.evaluationPeriodRecordForm.get('fechaFinAuditoria').value;
        periodoEvaluacion.periodoEvaluacionEtapas.push(new PeriodoEvaluacionEtapaAddUpdateDTOV1().deserialize(etapa));

        if (this.data.id) {
            periodoEvaluacion.id = this.data.id;
            periodoEvaluacion.fechaCreacion = this.data.fechaCreacion;
            periodoEvaluacion.usuarioCreacion = this.data.usuarioCreacion;
            periodoEvaluacion.fechaModificacion = new Date();
            periodoEvaluacion.usuarioModificacion = this.users.userSession.id;
            const tmpPeriodoEvaluacion: PeriodoEvaluacionAddUpdateDTOV1 =
                new PeriodoEvaluacionAddUpdateDTOV1().deserialize(periodoEvaluacion);

            this.evaluationPeriod.updatePeriodEvaluation(tmpPeriodoEvaluacion).subscribe(() => {
                Alert.success('', 'Periodo de Evaluación actualizado correctamente');
                this.ref.close(true);
            });
        } else {
            periodoEvaluacion.fechaCreacion = new Date();
            periodoEvaluacion.usuarioCreacion = this.users.userSession.id;
            this.evaluationPeriod.createPeriodEvaluation(periodoEvaluacion).subscribe(() => {
                Alert.success('', 'Periodo de Evaluación creado correctamente');
                this.ref.close(true);
            });
        }
    }

    private getAllCycles(): void {
        const filters = new TablePaginatorSearch();
        filters.pageSize = 100;
        filters.filter = { activo: true };
        this.cycles.getAllCycles(filters).subscribe((response) => {
            if (response.output) {
                this.cycleList = response.output.map((ciclo) => new CicloV1().deserialize(ciclo));
            }
        });
    }

    private getAllInstitution(): void {
        const filters = new TablePaginatorSearch();
        filters.pageSize = 100;
        filters.filter = { activo: true };
        this.institutions.getAllInstitutions(filters).subscribe((response) => {
            if (response.output) {
                this.institutionList = response.output.map((item) => new InstitucionDTOV1().deserialize(item));
            }
        });
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
        this.subscription.add(this.evaluationPeriodRecordForm.statusChanges.subscribe(() => (this.edit = true)));
    }

    stringToDate(date: string): Date {
        return DateHelper.convertToDate(date);
    }

    addPeriodToDate(date: string, period: any, amount: number): Date {
        return DateHelper.addPeriodToDate(date, period, amount);
    }

    onFechaInicialMetaChange(): void {
        this.evaluationPeriodRecordForm.get('fechaFinMeta').setValue(null);
        this.evaluationPeriodRecordForm.get('fechaInicialCapturaResultados').setValue(null);
        this.evaluationPeriodRecordForm.get('fechaFinCapturaResultados').setValue(null);
        this.evaluationPeriodRecordForm.get('fechaInicialAutoEvaluacion').setValue(null);
        this.evaluationPeriodRecordForm.get('fechaFinAutoEvaluacion').setValue(null);
        this.evaluationPeriodRecordForm.get('fechaInicialRevision').setValue(null);
        this.evaluationPeriodRecordForm.get('fechaFinRevision').setValue(null);
        this.evaluationPeriodRecordForm.get('fechaFinCargaEvidencia').setValue(null);
        this.evaluationPeriodRecordForm.get('fechaInicialPlanMejora').setValue(null);
        this.evaluationPeriodRecordForm.get('fechaFinPlanMejora').setValue(null);
        this.evaluationPeriodRecordForm.get('fechaFinAuditoria').setValue(null);
    }

    onFechaFinalMetaChange(): void {
        this.evaluationPeriodRecordForm.get('fechaInicialCapturaResultados').setValue(null);
        this.evaluationPeriodRecordForm.get('fechaFinCapturaResultados').setValue(null);
        this.evaluationPeriodRecordForm.get('fechaInicialAutoEvaluacion').setValue(null);
        this.evaluationPeriodRecordForm.get('fechaFinAutoEvaluacion').setValue(null);
        this.evaluationPeriodRecordForm.get('fechaInicialRevision').setValue(null);
        this.evaluationPeriodRecordForm.get('fechaFinRevision').setValue(null);
        this.evaluationPeriodRecordForm.get('fechaInicialPlanMejora').setValue(null);
        this.evaluationPeriodRecordForm.get('fechaFinPlanMejora').setValue(null);
        this.evaluationPeriodRecordForm.get('fechaFinAuditoria').setValue(null);
    }

    onFechaInicialResultadosChange(): void {
        this.evaluationPeriodRecordForm.get('fechaFinCapturaResultados').setValue(null);
        this.evaluationPeriodRecordForm.get('fechaInicialAutoEvaluacion').setValue(null);
        this.evaluationPeriodRecordForm.get('fechaFinAutoEvaluacion').setValue(null);
        this.evaluationPeriodRecordForm.get('fechaInicialRevision').setValue(null);
        this.evaluationPeriodRecordForm.get('fechaFinRevision').setValue(null);
        this.evaluationPeriodRecordForm.get('fechaInicialPlanMejora').setValue(null);
        this.evaluationPeriodRecordForm.get('fechaFinPlanMejora').setValue(null);
        this.evaluationPeriodRecordForm.get('fechaFinAuditoria').setValue(null);
    }

    onFechaFinalResultadosChange(): void {
        this.evaluationPeriodRecordForm.get('fechaInicialAutoEvaluacion').setValue(null);
        this.evaluationPeriodRecordForm.get('fechaFinAutoEvaluacion').setValue(null);
        this.evaluationPeriodRecordForm.get('fechaInicialRevision').setValue(null);
        this.evaluationPeriodRecordForm.get('fechaFinRevision').setValue(null);
        this.evaluationPeriodRecordForm.get('fechaInicialPlanMejora').setValue(null);
        this.evaluationPeriodRecordForm.get('fechaFinPlanMejora').setValue(null);
        this.evaluationPeriodRecordForm.get('fechaFinAuditoria').setValue(null);
    }

    onFechaInicialAutoevaluacionChange(): void {
        this.evaluationPeriodRecordForm.get('fechaFinAutoEvaluacion').setValue(null);
        this.evaluationPeriodRecordForm.get('fechaInicialRevision').setValue(null);
        this.evaluationPeriodRecordForm.get('fechaFinRevision').setValue(null);
        this.evaluationPeriodRecordForm.get('fechaInicialPlanMejora').setValue(null);
        this.evaluationPeriodRecordForm.get('fechaFinPlanMejora').setValue(null);
        this.evaluationPeriodRecordForm.get('fechaFinAuditoria').setValue(null);
    }

    onFechaFinalAutoevaluacionChange(): void {
        this.evaluationPeriodRecordForm.get('fechaInicialRevision').setValue(null);
        this.evaluationPeriodRecordForm.get('fechaFinRevision').setValue(null);
        this.evaluationPeriodRecordForm.get('fechaInicialPlanMejora').setValue(null);
        this.evaluationPeriodRecordForm.get('fechaFinPlanMejora').setValue(null);
        this.evaluationPeriodRecordForm.get('fechaFinAuditoria').setValue(null);
    }

    onFechaInicialRevisionChange(): void {
        this.evaluationPeriodRecordForm.get('fechaFinRevision').setValue(null);
        this.evaluationPeriodRecordForm.get('fechaInicialPlanMejora').setValue(null);
        this.evaluationPeriodRecordForm.get('fechaFinPlanMejora').setValue(null);
        this.evaluationPeriodRecordForm.get('fechaFinAuditoria').setValue(null);
    }

    onFechaFinalRevisionChange(): void {
        this.evaluationPeriodRecordForm.get('fechaInicialPlanMejora').setValue(null);
        this.evaluationPeriodRecordForm.get('fechaFinPlanMejora').setValue(null);
        this.evaluationPeriodRecordForm.get('fechaFinAuditoria').setValue(null);
    }

    onFechaInicialMejoraChange(): void {
        this.evaluationPeriodRecordForm.get('fechaFinPlanMejora').setValue(null);
        this.evaluationPeriodRecordForm.get('fechaFinAuditoria').setValue(null);
    }

    onFechaFinalMejoraChange(): void {
        this.evaluationPeriodRecordForm.get('fechaFinAuditoria').setValue(null);
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
