import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
//import { HasElementRef } from '@angular/material/core/common-behaviors/color';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Alert, clearForm } from 'src/app/utils/helpers';
import { ConfigIndicatorsComponent } from '../config-indicators/config-indicators.component';
import {
    CatalogoElementoEvaluacionDTOV1,
    ComponenteDTOV1,
    ConfigElementosEvaluacionDTOV1,
    ConfigIndicadorDTOV1,
    ConfigRubricaEvaluacionDTOV1,
    ConfigRubricaEvaluacionDetDTOV1,
    IndicadorMIDTOV1,
    NormativaDTOV1,
    TablePaginatorSearch,
} from 'src/app/utils/models';
import { SelectionModel } from '@angular/cdk/collections';
import {
    ConfigEvaluationRubricDetailService,
    ConfigEvaluationRubricService,
    ConfigIndicatorService,
    GeneralConfigurationService,
    UsersService,
} from 'src/app/core/services';
import { ValidatorService } from 'src/app/shared/validators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RubricaEscalaDTOV1 } from 'src/app/utils/models/config-rubrica-escala.dto.v1';
import { Subscription } from 'rxjs';
import { ConfiguracionGeneral } from 'src/app/utils/models/configuracion-general';
import { saveAs } from 'file-saver';
import { Indicador } from 'src/app/utils/models/indicador';
import { IndicadorEvidencia } from 'src/app/utils/models/indicador-evidencia';
import Quill from 'quill';
import BlotFormatter, { DeleteAction, ImageSpec, ResizeAction } from 'quill-blot-formatter';
import { IndicadorNormativa } from 'src/app/utils/models/indicador-normativa';
import { ContentChange } from 'ngx-quill';

export class dataTableComponentElements {
    id: number;
    cfgComponentesId: number;
    cfgIndicadorId: number;
    configuracionGeneral: ConfiguracionGeneral;
    componente: ComponenteDTOV1;
    elemento: CatalogoElementoEvaluacionDTOV1;
    indicador: Indicador;
    indicadorMi: IndicadorMIDTOV1;
    normativa: NormativaDTOV1;
    evidencias: IndicadorEvidencia[];
    normativas: IndicadorNormativa[];
    activo: boolean;
}

Quill.register('modules/blotFormatter', BlotFormatter);

class CustomImageSpec extends ImageSpec {
    getActions() {
        return [ResizeAction, DeleteAction];
    }
}

@Component({
    selector: 'app-config-rubrica',
    templateUrl: './config-rubrica.component.html',
    styleUrls: ['./config-rubrica.component.scss'],
})
export class ConfigRubricaComponent implements OnInit {
    //@ViewChild('input', { static: true }) inputSearch: HasElementRef;
    @ViewChild('paginator', { static: true }) readonly paginator: MatPaginator;

    @ViewChild(ConfigIndicatorsComponent) configIndicator: ConfigIndicatorsComponent;
    MAX_LENGTH = 500;

    configGeneralData = new ConfiguracionGeneral();
    data: ConfigIndicadorDTOV1[];
    dataSource: MatTableDataSource<dataTableComponentElements>;
    dataSourceRubrica: MatTableDataSource<ConfigRubricaEvaluacionDetDTOV1>;
    selection: SelectionModel<ConfigIndicadorDTOV1>;

    cfgElementoEval: ConfigElementosEvaluacionDTOV1;
    cfgIndicador: ConfigIndicadorDTOV1;
    cfgIndicadorId: number;

    disabled: boolean;
    isHideModal: boolean;
    edit: boolean;
    subscription: Subscription;

    permission: boolean;
    filters: TablePaginatorSearch;
    pageIndex: number;
    pageSize: number;
    length: number;

    condicionCalidad: string;
    quillDisplayModuleOptions: any;
    quillEditorModuleOptions: any;
    htmlData: any;
    editorData: any;

    open: boolean;
    rubricaRecord: ConfigRubricaEvaluacionDetDTOV1;
    listaRubricas: ConfigRubricaEvaluacionDetDTOV1[];
    escalasList: RubricaEscalaDTOV1[];

    rubricaRecordForm: FormGroup;

    spans: any[] = [];
    spanningColumns = ['escala'];
    constructor(
        private users: UsersService,
        private router: Router,
        private readonly formBuilder: FormBuilder,
        private readonly validator: ValidatorService,
        private readonly generalConfiguration: GeneralConfigurationService,
        private cfgIndicatorsService: ConfigIndicatorService,
        private cfgRubricaService: ConfigEvaluationRubricService,
        private cfgRubricaDetService: ConfigEvaluationRubricDetailService,
        private ref: ChangeDetectorRef
    ) {
        this.rubricaRecordForm = this.formBuilder.group({
            escala: [null, [Validators.required]],
            // Detalle
            condicionCalidad: [null],
        });
        this.data = [];
        this.dataSource = new MatTableDataSource<dataTableComponentElements>([]);
        this.dataSourceRubrica = new MatTableDataSource<ConfigRubricaEvaluacionDetDTOV1>([]);
        this.selection = new SelectionModel<ConfigIndicadorDTOV1>(true);
        this.cfgElementoEval = null;
        this.disabled = null;
        this.permission = null;
        this.filters = new TablePaginatorSearch();
        this.edit = null;
        this.subscription = new Subscription();
        this.isHideModal = true;
        this.cfgIndicador = new ConfigIndicadorDTOV1();
        this.cfgIndicadorId = null;
    }

    ngOnInit() {
        this.open = false;

        this.pageSize = 5;
        this.pageIndex = this.filters.pageNumber;
        this.filters.pageSize = 5;
        this.filters.filter = {};

        this.quillDisplayModuleOptions = { toolbar: false };
        this.quillEditorModuleOptions = {
            blotFormatter: {
                specs: [CustomImageSpec],
            },
            syntax: false, // Include syntax module
            toolbar: [
                ['bold', 'italic', 'underline', 'strike', 'clean'], // toggled buttons
                [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
                [{ color: [] }, { background: [] }], // dropdown with defaults from theme
            ],
        };
    }

    tabInit(record: ConfiguracionGeneral): void {
        this.configGeneralData = record;
        if (record.configComponentes) {
            this.getAllScales();
            this.getAllConfigIndicators();
            this.ref.detectChanges();
            this.isHideModal = true;
            this.dataSourceRubrica.data = [];
            this.listaRubricas = [];
            this.spans = [];
        }
        this.condicionCalidad = '';
    }

    condicionCalidadChanged($event: ContentChange) {
        this.condicionCalidad = $event.html;
        if ($event.editor.getLength() > this.MAX_LENGTH) {
            $event.editor.deleteText(this.MAX_LENGTH, $event.editor.getLength());
        }
    }
    getAllConfigIndicators(): void {
        let arr: dataTableComponentElements[] = [];
        this.configGeneralData.configComponentes.forEach((itemComp) => {
            itemComp.configElementosEvaluacion.forEach((itemEle) => {
                if (itemEle.configIndicadores.length > 0) {
                    itemEle.configIndicadores.forEach((itemIndicador) => {
                        let nuevoItem = new dataTableComponentElements();
                        nuevoItem.id = itemIndicador.id;
                        nuevoItem.cfgIndicadorId = itemIndicador.id;
                        nuevoItem.configuracionGeneral = this.configGeneralData;
                        nuevoItem.elemento = itemIndicador.cfgElementosEvaluacion;
                        nuevoItem.componente = itemComp.componente;
                        nuevoItem.indicador = itemIndicador.indicadorSiac;
                        nuevoItem.indicadorMi = itemIndicador.indicadorMi;
                        nuevoItem.activo = itemIndicador.activo;
                        nuevoItem.evidencias = itemIndicador.configIndicadoresEvidencias.map((evidencia) =>
                            new IndicadorEvidencia().deserialize(evidencia)
                        );
                        nuevoItem.normativas = itemIndicador.configIndicadoresNormativas.map((normativa) =>
                            new IndicadorNormativa().deserialize(normativa)
                        );
                        arr.push(nuevoItem);
                    });
                }
            });
        });
        this.dataSource = new MatTableDataSource<dataTableComponentElements>([]);
        this.dataSource.data = arr;
        this.ref.detectChanges;
    }

    paginatorChange(event: PageEvent): void {
        this.filters.pageSize = event.pageSize;
        this.filters.pageNumber = event.pageIndex;
        this.getAllConfigIndicators();
    }

    editRubrica(record: dataTableComponentElements): void {
        this.rubricaRecordForm.reset();

        this.isHideModal = false;

        this.cfgIndicadorId = record.cfgIndicadorId;

        this.getAllRubricas();

        this.rubricaRecordForm.patchValue(new ConfigRubricaEvaluacionDetDTOV1());
        this.trackingStatusForm();
    }

    disableRubrica(record: dataTableComponentElements): void {
        Alert.confirm(
            ``,
            `¿Deseas ${record.activo ? 'Deshabilitar' : 'Habilitar'} la Rúbrica de Evaluación?`
        ).subscribe((result) => {
            if (!result || !result.isConfirmed) {
                return;
            }
            this.cfgRubricaService.disableEvaluationRubic(record.id, !record.activo).subscribe((response) => {
                if (response.exito) {
                    Alert.success('', response.mensaje);
                    record.activo = !record.activo;
                    //this.getAllConfigIndicators();
                } else {
                    console.error(response.mensaje);
                    Alert.error(
                        '',
                        `No se puede ${record.activo ? 'Deshabilitar' : 'Habilitar'} la Rúbrica de Evaluación`
                    );
                }
            });
        });
    }

    getAllRubricasExcel(): void {
        this.cfgIndicatorsService
            .getAllConfigIndicadorExcel(
                this.configGeneralData.periodoEvaluacionId,
                this.configGeneralData.areaResponsableId
            )
            .subscribe((response) => saveAs(response, 'RubricaEvaluacion.xlsx'));
    }

    /* --------------------------- */

    getAllScales() {
        this.escalasList = [];
        this.cfgRubricaService.getAllScalesRubric().subscribe((response) => {
            if (response.output) {
                this.escalasList = response.output.map((configuracion) =>
                    new RubricaEscalaDTOV1().deserialize(configuracion)
                );
            }
        });
    }

    getAllRubricas() {
        this.dataSourceRubrica.data = [];
        this.listaRubricas = [];
        const filters = new TablePaginatorSearch();
        filters.pageNumber = 0;
        filters.pageSize = 1000;
        filters.filter = { activo: true, cfgIndicadorId: this.cfgIndicadorId };
        this.cfgRubricaDetService.getAllEvaluationRubricDetail(filters).subscribe((response) => {
            if (response.output) {
                this.listaRubricas = response.output.map((configuracion) =>
                    new ConfigRubricaEvaluacionDetDTOV1().deserialize(configuracion)
                );
                // this.listaRubricas.forEach((element) => {
                //     element.escalaNavigation = this.escalasList.find(
                //         (item) => item.escala == element.cfgRubricaEvaluacion.escala
                //     );
                // });
                this.dataSourceRubrica.data = this.listaRubricas;
                this.spans = [];
                this.cacheSpan('escala', (d: ConfigRubricaEvaluacionDetDTOV1) => d.escala);
            }
        });
    }

    cacheSpan(key: string, accessor: any) {
        for (let i = 0; i < this.listaRubricas.length; ) {
            let currentValue = accessor(this.listaRubricas[i]);
            let count = 1;

            // Iterate through the remaining rows to see how many match
            // the current value as retrieved through the accessor.
            for (let j = i + 1; j < this.listaRubricas.length; j++) {
                if (currentValue != accessor(this.listaRubricas[j])) {
                    break;
                }

                count++;
            }

            if (!this.spans[i]) {
                this.spans[i] = {};
            }

            // Store the number of similar values that were found (the span)
            // and skip i to the next unique row.
            this.spans[i][key] = count;
            i += count;
        }
    }

    getRowSpan(col: string, index: number) {
        return this.spans[index] && this.spans[index][col];
    }

    submit(): void {}

    backRubrica(): void {
        this.isHideModal = true;
        this.rubricaRecordForm.reset();
        //this.dataSourceRubrica.data = [];
        //this.escalasList = [];
        //this.listaRubricas = [];
        //this.cfgIndicador = null;
    }

    addRubricaEscala(): void {
        if (
            this.rubricaRecordForm.get('condicionCalidad').value == null ||
            this.rubricaRecordForm.get('condicionCalidad').value == ''
        ) {
            Alert.warn('El campo condiciones de calidad es obligatorio');
            return;
        }

        if (this.rubricaRecordForm.get('condicionCalidad').value.length > this.MAX_LENGTH) {
            Alert.warn(`El campo condiciones de calidad tiene una longitud máxima de ${this.MAX_LENGTH} caracteres`);
            return;
        }

        this.rubricaRecordForm.markAllAsTouched();
        if (this.rubricaRecordForm.invalid) {
            Alert.error('Verifique que los campos sean correctos');
            return;
        }
        clearForm(this.rubricaRecordForm);
        const tmp = this.rubricaRecordForm.getRawValue();
        const record: ConfigRubricaEvaluacionDetDTOV1 = new ConfigRubricaEvaluacionDetDTOV1().deserialize(tmp);
        let escala = this.escalasList.find((item) => item.escala == tmp.escala);
        record.escalaNavigation = escala;
        record.cfgIndicadorId = this.cfgIndicadorId;
        record.cfgRubricaEvaluacion = new ConfigRubricaEvaluacionDTOV1();
        record.cfgRubricaEvaluacion.cfgIndicadorId = this.cfgIndicadorId;
        record.cfgRubricaEvaluacion.escala = escala.escala;
        record.cfgRubricaEvaluacion.descripcion = escala.descripcion;
        record.condicionCalidad = this.condicionCalidad;
        // let seleccion = this.listaRubricas.find(
        //     (item) => item.condicionCalidad.trim().toLowerCase() == record.condicionCalidad.trim().toLowerCase()
        // );
        // if (seleccion) {
        //     Alert.error('Existe una Condición de Calidad con el mismo nombre');
        // } else {
        record.activo = true;
        record.fechaCreacion = new Date();
        record.usuarioCreacion = this.users.userSession.id;
        record.cfgRubricaEvaluacion.fechaCreacion = new Date();
        record.cfgRubricaEvaluacion.usuarioCreacion = this.users.userSession.id;
        record.cfgRubricaEvaluacion.activo = true;
        this.cfgRubricaDetService.createEvaluationRubricDetail(record).subscribe(() => {
            Alert.success('', 'Rubrica de Evaluación creada correctamente');
            this.rubricaRecordForm.reset();
            this.condicionCalidad = '';
            this.getAllRubricas();
        });
        // }
    }

    UpdateRubricaDet(record: ConfigRubricaEvaluacionDetDTOV1, event: any): void {
        this.rubricaRecord = new ConfigRubricaEvaluacionDetDTOV1().deserialize(record);
        this.rubricaRecord.cfgIndicadorId = this.cfgIndicadorId;
        this.rubricaRecord.condicionCalidad = event.target.value;
        this.rubricaRecord.fechaModificacion = new Date();
        this.rubricaRecord.usuarioModificacion = this.users.userSession.id;
        this.cfgRubricaDetService.updateEvaluationRubricDetail(this.rubricaRecord).subscribe((response) => {
            if (response.exito) {
                this.getAllRubricas();
                Alert.success('', 'Rubrica de Evaluación actualizada correctamente');
            } else Alert.warn('', 'La Rubrica de Evaluación no puede ser actualizada, verifique');
        });
    }

    editRubricaEscala(record: ConfigRubricaEvaluacionDetDTOV1): void {
        this.rubricaRecordForm.patchValue(record);
        this.rubricaRecordForm.get('escala').setValue(record.escala);
        this.htmlData = record.condicionCalidad;
        this.rubricaRecordForm.get('condicionCalidad').setValue(this.htmlData);
        this.rubricaRecordForm.updateValueAndValidity();
        this.trackingStatusForm();
        // Delete from table
        this.cfgRubricaDetService.deleteEvaluationRubricDetail(record.id).subscribe((response) => {
            this.getAllRubricas();
        });
    }

    deleteRubricaEscala(record: ConfigRubricaEvaluacionDetDTOV1): void {
        Alert.confirm('Eliminar Condición Calidad', `¿Deseas eliminar el Condición Calidad?`).subscribe((result) => {
            if (!result || !result.isConfirmed) {
                return;
            }
            this.cfgRubricaDetService.deleteEvaluationRubricDetail(record.id).subscribe((response) => {
                if (response.exito) {
                    Alert.success('', 'Condición Calidad eliminada correctamente');
                } else {
                    console.error(response.mensaje);
                    Alert.error('', 'No se puede eliminar la Condición Calidad');
                }
                this.getAllRubricas();
            });
        });
    }

    getEscalaStr(escala: number): string {
        //const cEscala = this.escalasList.find((item) => item.escala == escala);
        if (escala == -1) return `NA`;
        else return `${escala}`;
    }

    contentChanged(contentChangedEvent: any) {
        this.condicionCalidad = contentChangedEvent.html;
    }

    private trackingStatusForm(): void {
        this.subscription.add(this.rubricaRecordForm.statusChanges.subscribe(() => (this.edit = true)));
    }
}
