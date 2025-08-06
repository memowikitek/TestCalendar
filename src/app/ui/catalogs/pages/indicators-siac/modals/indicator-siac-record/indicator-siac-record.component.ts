import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ComponentsService, EvaluationElementCatalogService, UsersService } from 'src/app/core/services';
import { IndicatorSiacService } from 'src/app/core/services/api/indicator-siac/indicator-siac.service';
import { ValidatorService } from 'src/app/shared/validators';
import { Alert, clearForm } from 'src/app/utils/helpers';
import {
    CatalogoElementoEvaluacionDTOV1,
    ComponenteDTOV1,
    IndicadorSiacDTOV1,
    TablePaginatorSearch,
    Vista,
} from 'src/app/utils/models';
import { IndicatorSiacData } from './indicator-siac-record.service';
import { ModuleIdV2 } from 'src/app/utils/enums/modules-idV2';
import { Router } from '@angular/router';
import { ModulesCatalogDTO } from 'src/app/utils/models/modules-catalog.dto';
import { MatSelectChange } from '@angular/material/select';

export enum ModalTitle {
    NEW = 'Nuevo indicador SIAC',
    EDIT = 'Editar indicador SIAC',
}
@Component({
    selector: 'app-indicator-siac-record',
    templateUrl: './indicator-siac-record.component.html',
    styleUrls: ['./indicator-siac-record.component.scss'],
})
export class IndicatorSiacRecordComponent implements OnInit, OnDestroy {
    indicatorSiacRecordForm: FormGroup;
    title: ModalTitle;
    data: IndicadorSiacDTOV1;
    elementoEvaluacionList: CatalogoElementoEvaluacionDTOV1[];
    componentsList: ComponenteDTOV1[];
    edit: boolean;
    subscription: Subscription;
    disabled: boolean;
    permission: boolean;
    thisAccess: Vista;
    thisModule: ModulesCatalogDTO;
    permissions: boolean[];
    constructor(
        @Inject(MAT_DIALOG_DATA)
        public readonly indicatorSiacData: IndicatorSiacData,
        private router: Router,
        public readonly indicatorSiacService: IndicatorSiacService,
        private readonly evaluationElementCatalogService: EvaluationElementCatalogService,
        private readonly components: ComponentsService,
        private readonly formBuilder: FormBuilder,
        private readonly ref: MatDialogRef<never>,
        private users: UsersService,
        private readonly validator: ValidatorService
    ) {
        this.title = ModalTitle.NEW;
        this.data = new IndicadorSiacDTOV1();
        this.edit = null;
        this.disabled = null;
        this.permission = null;
        this.elementoEvaluacionList = [];
        this.componentsList = [];

        this.subscription = new Subscription();
        this.indicatorSiacRecordForm = this.formBuilder.group({
            clave: [null, [Validators.required, Validators.maxLength(10), this.validator.noWhitespace]],
            nombre: [null, [Validators.required, Validators.maxLength(500), this.validator.noWhitespace]],
            descripcion: [null, [Validators.required, Validators.maxLength(500), this.validator.noWhitespace]],
            elementoEvaluacionId: [null, [Validators.required]],
            componenteId: [null, [Validators.required]],
            activo: [true, []],
        });
        this.thisAccess = new Vista();
        this.permissions = [false, false, false];
    }

    ngOnInit() {
        this.setPermissions();
        this.disabled = !this.checkPermission(2);
        this.title = this.indicatorSiacData ? ModalTitle.EDIT : ModalTitle.NEW;
        this.getAllElementosEvaluacion();
        this.getAllComponentes();

        if (this.indicatorSiacData) {
            this.indicatorSiacService.getIndicatorSiacById(this.indicatorSiacData.data.id).subscribe((response) => {
                if (!response.output) {
                    return;
                }
                const data = new IndicadorSiacDTOV1().deserialize(response.output);
                this.data = data;
                this.indicatorSiacRecordForm.patchValue(data);
                this.indicatorSiacRecordForm.get('componenteId').patchValue(data.elementoEvaluacion.componenteId);
                if (data.elementoEvaluacion.componenteId == null)
                    Alert.warn('', 'El Elemento de Evaluación no tiene Componente seleccionado');
                this.indicatorSiacRecordForm.get('clave').disable();
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
        this.indicatorSiacRecordForm.markAllAsTouched();
        if (this.indicatorSiacRecordForm.invalid) {
            Alert.error('Verifique que los campos sean correctos');
            return;
        }
        clearForm(this.indicatorSiacRecordForm);
        const tmp = this.indicatorSiacRecordForm.getRawValue();
        const indicadorSiac: IndicadorSiacDTOV1 = new IndicadorSiacDTOV1().deserialize(tmp);
        if (this.data.id) {
            indicadorSiac.id = this.data.id;
            indicadorSiac.fechaCreacion = this.data.fechaCreacion;
            indicadorSiac.usuarioCreacion = this.data.usuarioCreacion;
            indicadorSiac.fechaModificacion = new Date();
            indicadorSiac.usuarioModificacion = this.users.userSession.id;
            this.indicatorSiacService.updateIndicatorSiac(indicadorSiac).subscribe(() => {
                Alert.success('', 'Indicador SIAC actualizado correctamente');
                this.ref.close(true);
            });
        } else {
            indicadorSiac.fechaCreacion = new Date();
            indicadorSiac.usuarioCreacion = this.users.userSession.id;
            this.indicatorSiacService.createIndicatorSiac(indicadorSiac).subscribe(() => {
                Alert.success('', 'Indicador SIAC creado correctamente');
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

    getAllElementosEvaluacion() {
        const filters = new TablePaginatorSearch();
        filters.pageSize = 1000;
        filters.filter = { activo: true };
        this.elementoEvaluacionList = [];
        this.evaluationElementCatalogService.getAllEvaluationElementsCatalogs(filters).subscribe((response) => {
            if (response.output) {
                this.elementoEvaluacionList = response.output.map((campus) =>
                    new CatalogoElementoEvaluacionDTOV1().deserialize(campus)
                );
            }
        });
    }

    getAllComponentes() {
        const filter = new TablePaginatorSearch();
        filter.pageSize = 1000;
        filter.filter = { activo: true };
        this.componentsList = [];
        this.components.getAllComponents(filter).subscribe((response) => {
            if (response.output) {
                this.componentsList = response.output.map((componente) =>
                    new ComponenteDTOV1().deserialize(componente)
                );
            }
        });
    }

    onChangeElement(event: MatSelectChange): void {
        const elementoEvaluacion = this.elementoEvaluacionList.find((item) => item.id == event.value);
        this.indicatorSiacRecordForm.get('componenteId').patchValue(elementoEvaluacion.componenteId);
        if (elementoEvaluacion.componenteId === null)
            Alert.warn('', 'El Elemento de Evaluación no tiene Componente seleccionado');
    }

    private trackingStatusForm(): void {
        this.subscription.add(this.indicatorSiacRecordForm.statusChanges.subscribe(() => (this.edit = true)));
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
