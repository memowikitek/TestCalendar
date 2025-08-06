import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { MatrixMiService } from 'src/app/core/services/api/matrix-mi/matrix-mi.service';
import { ValidatorService } from 'src/app/shared/validators';
import { Alert, clearForm } from 'src/app/utils/helpers';
import {
    ComponenteMIDTOV1,
    IndicadorMIDTOV1,
    MatrizMIDTOV1,
    SubIndicadorMIDTOV1,
    TablePaginatorSearch,
} from 'src/app/utils/models';
import { IndicatorMiService } from 'src/app/core/services/api/indicator-mi/indicator-mi.service';
import { SubindicatorMiService } from 'src/app/core/services/api/subindicator-mi/subindicator-mi.service';
import { ComponentMiService } from 'src/app/core/services/api/component-mi/component-mi.service';
import { MatrixMIData } from './matrix-mi-record.service';

export enum ModalTitle {
    NEW = 'Asociar elementos Mi',
    EDIT = 'Editar elementos Mi',
}

@Component({
    selector: 'app-matrix-mi-record',
    templateUrl: './matrix-mi-record.component.html',
    styleUrls: ['./matrix-mi-record.component.scss'],
})
export class MatrixMiRecordComponent implements OnInit {
    title: ModalTitle;
    data: MatrizMIDTOV1;
    edit: boolean;
    subscription: Subscription;
    disabled: boolean;
    permission: boolean;
    matrixMiRecordForm: FormGroup;
    componentMiList: ComponenteMIDTOV1[];
    indicatorMiList: IndicadorMIDTOV1[];
    subIndicatorMiList: SubIndicadorMIDTOV1[];
    filters: TablePaginatorSearch;
    constructor(
        @Inject(MAT_DIALOG_DATA)
        public readonly matrixMiData: MatrixMIData,
        private readonly formBuilder: FormBuilder,
        private readonly ref: MatDialogRef<never>,
        private readonly validator: ValidatorService,
        private readonly indicatorMiService: IndicatorMiService,
        private readonly subindicatorMiService: SubindicatorMiService,
        private readonly componentMiService: ComponentMiService,
        private readonly matrixMiService: MatrixMiService
    ) {
        this.subscription = new Subscription();
        this.title = ModalTitle.NEW;
        this.data = new MatrizMIDTOV1();
        this.edit = null;
        this.disabled = null;
        this.permission = null;
        this.componentMiList = [];
        this.indicatorMiList = [];
        this.subIndicatorMiList = [];
        this.filters = new TablePaginatorSearch();
        this.matrixMiRecordForm = this.formBuilder.group({
            clave: [null, [Validators.required, Validators.maxLength(50), this.validator.noWhitespace]],
            componenteMiId: [null, [Validators.required]],
            descripcionComponenteMi: [null, []],
            indicadorMis: [[], [Validators.required]],
            subIndicadorMis: [[], [Validators.required]],
            activo: [true, []],
        });
    }

    ngOnInit(): void {
        this.getAllComponentsMi(this.filters);
        this.getAllIndicatorsMi(this.filters);
        this.getAllSubIndicatorsMi(this.filters);
        this.title = this.matrixMiData ? ModalTitle.EDIT : ModalTitle.NEW;
        if (this.matrixMiData) {
            this.matrixMiService.getMatrizMiById(this.matrixMiData.data.id).subscribe((response) => {
                if (!response.output) {
                    return;
                }
                const data = new MatrizMIDTOV1().deserialize(response.output[0]);
                this.data = data;
                this.matrixMiRecordForm.patchValue(data);
                // const subIndicatorList: number[] = this.data.subIndicadoresMi.map((i) => i.id);
                // const IndicatorList: number[] = this.data.indicadoresMi.map((i) => i.id);
                // this.matrixMiRecordForm.get('indicadorMis').setValue(IndicatorList);
                // this.matrixMiRecordForm.get('subIndicadorMis').setValue(subIndicatorList);
                // this.checkPermission();
                this.trackingStatusForm();
            });
        } else {
            // this.checkPermission();
            this.trackingStatusForm();
        }
    }

    submit(): void {
        this.matrixMiRecordForm.markAllAsTouched();
        if (this.matrixMiRecordForm.invalid) {
            Alert.error('Verifique que los campos sean correctos');
            return;
        }
        clearForm(this.matrixMiRecordForm);
        const tmp = this.matrixMiRecordForm.getRawValue();
        const matrizMi: MatrizMIDTOV1 = new MatrizMIDTOV1().deserialize(tmp);
        // const indicadorMiListSelect = this.indicatorMiList.filter((i) => tmp.indicadorMis.includes(i.id));
        // const subIndicadorMiListSelect = this.subIndicatorMiList.filter((i) => tmp.subIndicadorMis.includes(i.id));
        // matrizMi.indicadoresMi = indicadorMiListSelect;
        // matrizMi.subIndicadoresMi = subIndicadorMiListSelect;
        // console.log(tmp);
        if (this.data.componenteMi) {
            matrizMi.id = this.data.id;
            this.matrixMiService.updateMatrizMi(matrizMi).subscribe(() => {
                Alert.success('', 'Matriz Mi actualizado correctamente');
                this.ref.close(true);
            });
        } else {
            this.matrixMiService.createMatrizMi(matrizMi).subscribe(() => {
                Alert.success('', 'Matriz Mi creado correctamente');
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

    componentMiSelect(componenteMiId: string): void {
        const componenteMi: ComponenteMIDTOV1 = this.componentMiList.find((i) => i.id == componenteMi.id);
        this.matrixMiRecordForm.get('descripcionComponenteMi').setValue(componenteMi.descripcion);
    }

    private trackingStatusForm(): void {
        this.subscription.add(this.matrixMiRecordForm.statusChanges.subscribe(() => (this.edit = true)));
    }

    private getAllIndicatorsMi(filter: TablePaginatorSearch): void {
        filter.inactives = true;
        filter.pageSize = -1;
        this.indicatorMiService.getAllIndicatorMi(filter).subscribe((response) => {
            if (response.output) {
                this.indicatorMiList = response.output.map((indicador) =>
                    new IndicadorMIDTOV1().deserialize(indicador)
                );
            }
        });
    }

    private getAllSubIndicatorsMi(filter: TablePaginatorSearch): void {
        filter.inactives = true;
        filter.pageSize = -1;
        this.subindicatorMiService.getAllSubIndicatorMi(filter).subscribe((response) => {
            if (response.output) {
                this.subIndicatorMiList = response.output.map((subIndicador) =>
                    new SubIndicadorMIDTOV1().deserialize(subIndicador)
                );
            }
        });
    }

    private getAllComponentsMi(filter: TablePaginatorSearch): void {
        filter.inactives = true;
        filter.pageSize = -1;
        this.componentMiService.getAllComponentMi(filter).subscribe((response) => {
            if (response.output) {
                this.componentMiList = response.output.map((subIndicador) =>
                    new ComponenteMIDTOV1().deserialize(subIndicador)
                );
            }
        });
    }
}
