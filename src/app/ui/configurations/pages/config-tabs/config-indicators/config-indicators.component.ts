import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelectChange } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { saveAs } from 'file-saver';
import { FileValidators } from 'ngx-file-drag-drop';
import { Observable, Subject, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import {
    ComponentMiService,
    ConfigEvaluationRubricDetailService,
    ConfigIndicatorService,
    CorporateAreaService,
    CorporateSubAreaService,
    EvidencesCatalogService,
    IndicatorMiService,
    IndicatorSiacService,
    NormativeService,
    PilarEstrategicoMiService,
    SubindicatorMiService,
    UsersService,
} from 'src/app/core/services';
import { LIMIT_BLOB_SIZE_EVIDENCIA, LIMIT_SIZE_EVIDENCIA } from 'src/app/utils/constants';
import { Alert, clearForm } from 'src/app/utils/helpers';
import {
    AreaCorporativaDTOV1,
    AreaResponsableDTOV1,
    ComponenteDTOV1,
    ComponenteMIDTOV1,
    ConfigIndicadorDTOV1,
    ConfigRubricaEvaluacionDTOV1,
    ConfigRubricaEvaluacionDetDTOV1,
    EvidenceDTO,
    FileAzureDTOV1,
    IndicadorMIDTOV1,
    IndicadorSiacDTO,
    IndicadorSiacDTOV1,
    NormativaDTOV1,
    PilarEstrategicoMIDTOV1,
    SubAreaCorporativaDTOV1,
    SubIndicadorMIDTOV1,
    TablePaginatorSearch,
} from 'src/app/utils/models';
import { ConfigIndicadoresModel } from 'src/app/utils/models/ConfigIndicadores.dto.v1';
import { ConfigIndicadoresFormDTOV1 } from 'src/app/utils/models/ConfigIndicadoresForm.dto.v1';
import { ConfigComponentes } from 'src/app/utils/models/config-componentes';
import { ConfigElementosEvaluacion } from 'src/app/utils/models/config-elementos-evaluacion';
import { ConfigIndicadores } from 'src/app/utils/models/config-indicadores';
import { RubricaEscalaDTOV1 } from 'src/app/utils/models/config-rubrica-escala.dto.v1';
import { ConfiguracionGeneral } from 'src/app/utils/models/configuracion-general';
import { Indicador } from 'src/app/utils/models/indicador';
import { IndicadorEvidencia } from 'src/app/utils/models/indicador-evidencia';
import { IndicadorNormativa } from 'src/app/utils/models/indicador-normativa';
import { environment } from 'src/environments/environment';

export enum ModalTitle {
    NEW = 'Nuevo Indicador',
    EDIT = 'Editar Indicador',
}

export class dataTableComponentElements {
    id: number;
    cfgComponentesId: number;
    configuracionGeneral: ConfiguracionGeneral;
    componente: ComponenteDTOV1;
    elemento: ConfigElementosEvaluacion;
    indicador: Indicador;
    evidenciaIndicador: IndicadorEvidencia[];
    normativaIndicador: IndicadorNormativa[];
}

@Component({
    selector: 'app-config-indicators',
    templateUrl: './config-indicators.component.html',
    styleUrls: ['./config-indicators.component.scss'],
})
export class ConfigIndicatorsComponent implements OnInit {
    separatorKeysCodes: number[] = [ENTER, COMMA];
    configGeneralData = new ConfiguracionGeneral();
    // lists
    siacIndicatorList: IndicadorSiacDTOV1[] = [];
    siacIndicatorSelectedList: IndicadorSiacDTOV1[] = [];
    areaCorpList: AreaCorporativaDTOV1[] = [];
    subAreaCorpList: SubAreaCorporativaDTOV1[] = [];
    subAreaCorpFilterList: SubAreaCorporativaDTOV1[] = [];
    subAreaCorpSelectList: SubAreaCorporativaDTOV1[] = [];

    normativeList: NormativaDTOV1[] = [];
    normativeToSelectList: NormativaDTOV1[] = [];
    normativeFilteredList: Observable<NormativaDTOV1[]>;
    normativeSelectedList: NormativaDTOV1[] = [];

    evidenceCatalogList: EvidenceDTO[] = [];
    evidenceToSelectedList: EvidenceDTO[] = [];
    evidenceFilteredList: Observable<EvidenceDTO[]>;
    evidenceSelectedList: EvidenceDTO[] = [];
    dataTableEvidences: MatTableDataSource<IndicadorEvidencia>;
    evidenceFileList: IndicadorEvidencia[] = [];

    subIndicatorMiList: SubIndicadorMIDTOV1[] = [];
    indicatorMiList: IndicadorMIDTOV1[] = [];
    pilarEstrategicoMiList: PilarEstrategicoMIDTOV1[] = [];
    componenteMiList: ComponenteMIDTOV1[] = [];

    subIndicatorMiSelList: SubIndicadorMIDTOV1[] = [];
    indicatorMiSelList: IndicadorMIDTOV1[] = [];
    pilarEstrategicoMiSelList: PilarEstrategicoMIDTOV1[] = [];
    //
    edit: boolean;
    editRecord: boolean;
    subscription: Subscription;
    [x: string]: any;
    @ViewChild('input', { static: true }) inputSearch: ElementRef;
    @ViewChild('paginator', { static: true }) readonly paginator: MatPaginator;
    @ViewChild('normativaInput') normativaInput: ElementRef<HTMLInputElement>;

    data: IndicadorSiacDTO[];
    dataSource: MatTableDataSource<IndicadorSiacDTO>;
    dataTableComponentElements: MatTableDataSource<dataTableComponentElements>;
    //
    disabled: boolean;
    filters: TablePaginatorSearch;
    pageIndex: number;
    pageSize: number;
    length: number;
    open: boolean;
    title: ModalTitle;
    //
    componenteSelected: ComponenteDTOV1;
    elementoSelected: ConfigElementosEvaluacion;
    indicadorSelected: Indicador;
    cfgIndicadorId: number;
    //
    indicadorSiacRecordForm : FormGroup;

    listaRubricas: ConfigRubricaEvaluacionDetDTOV1[];

    constructor(
        private readonly formBuilder: FormBuilder,
        private serviceapiConfigIndicator: ConfigIndicatorService,
        private serviceapiSiac: IndicatorSiacService,
        private serviceapiComponenteMi: ComponentMiService,
        private serviceapiPilarEstrategicoMi: PilarEstrategicoMiService,
        private serviceapiIndicatorMi: IndicatorMiService,
        private serviceapiSubIndicatorMi: SubindicatorMiService,
        private serviceapiCorporateArea: CorporateAreaService,
        private serviceapiCorporateSubArea: CorporateSubAreaService,
        private serviceapiNormative: NormativeService,
        private serviceapiEvidencesCatalog: EvidencesCatalogService,
        private cfgRubricaDetService: ConfigEvaluationRubricDetailService,
        private ref: ChangeDetectorRef,
        private users: UsersService,
        public dialog: MatDialog
    ) {
        this.edit = null;
        this.title = ModalTitle.NEW;
        this.subscription = new Subscription();
        this.indicadorSiacRecordForm = this.formBuilder.group({
            // Primer sección
            componente: [null, [Validators.required]],
            elementoEvaluacion: [null, [Validators.required]],
            indicadorSIAC: [null, [Validators.required]],
            // Segunda sección
            normativa: [null, []],
            evidencia: [null, []],
            // Tercera sección
            areaCorporativa: [null, [Validators.required]],
            subAreasCorporativas: [null, [Validators.required]],
            // Cuarta sección
            componenteMI: [null, []],
            pilarEstrategico: [null, []],
            indicadorMI: [null, []],
            subIndicadorMI: [null, []],
            //
            formatoEvidencia: [null, []],
        });

        this.indicadorSiacRecordForm = this.formBuilder.group({
            // Primer sección
            componente: [null, [Validators.required]],
            elementoEvaluacion: [null, [Validators.required]],
            indicadorSIAC: [null, [Validators.required]],
            // Segunda sección
            normativa: [null, []],
            evidencia: [null, []],
            // Tercera sección
            areaCorporativa: [null, [Validators.required]],
            subAreasCorporativas: [null, [Validators.required]],
            // Cuarta sección
            componenteMI: [null, []],
            pilarEstrategico: [null, []],
            indicadorMI: [null, []],
            subIndicadorMI: [null, []],
            //
            formatoEvidencia: [null, []],
        });

        this.normativeFilteredList = this.indicadorSiacRecordForm.get('normativa').valueChanges.pipe(
            startWith(null),
            map((valor: string | null) => (valor ? this.filterNormativa(valor) : this.normativeToSelectList.slice()))
        );

        this.evidenceFilteredList = this.indicadorSiacRecordForm.get('evidencia').valueChanges.pipe(
            startWith(null),
            map((valor: string | null) => (valor ? this.filterEvidencia(valor) : this.evidenceToSelectedList.slice()))
        );
    }

    private filterNormativa(valor: string | null): NormativaDTOV1[] {
        if (valor) {
            if (valor.length < 3) return [];
            return this.normativeToSelectList.filter((item) => item.nombre.toLowerCase().includes(valor.toLowerCase()));
        }
        return [];
    }

    private filterEvidencia(valor: string | null): EvidenceDTO[] {
        if (valor) {
            if (valor.length < 3) return [];
            return this.evidenceToSelectedList.filter((item) =>
                item.nombre.toLowerCase().includes(valor.toLowerCase())
            );
        }
        return [];
    }

    submit(): void {
        this.addIndicador();
    }

    ngOnInit() {
        this.open = false;
        this.data = [];
        this.dataSource = new MatTableDataSource<IndicadorSiacDTO>([]);
        this.dataTableComponentElements = new MatTableDataSource<dataTableComponentElements>([]);
        this.dataTableEvidences = new MatTableDataSource<IndicadorEvidencia>([]);
        this.evidenceFileList = [];
        this.evidenceSelectedList = [];
        this.evidenceToSelectedList = [];
        this.normativeSelectedList = [];
        this.normativeToSelectList = [];
        this.filters = new TablePaginatorSearch();
        this.filters.filter = { activo: true };
        this.GetAllList(this.filters);
        this.configGeneralData.configComponentes = [];
        this.configElementosEvaluacionSeleccionados = [];
        this.cfgIndicadorId = null;
    }

    configuracionGeneral = new ConfiguracionGeneral();
    configElementosEvaluacionSeleccionados: ConfigElementosEvaluacion[];
    configElementosEvaluacionActual: ConfigElementosEvaluacion;
    tabInit(record: ConfiguracionGeneral): void {
        this.configGeneralData = record;
        this.listaRubricas = [];
        //Todo: agregar el listado de compoenentes que ya trae la configuracion general desde el primer query debe de ser un array de este modelo ConfigElementosEvaluacionDTOV1
        // para descomentarcodigo de asignacion a la tabla princioal importante debe tener el configComponentesId para poder eliminar
        this.filters.pageNumber = 0;
        this.filters.pageSize = 1000;
        this.filters.filter = { activo: true };
        this.GetAllList(this.filters);
        let areaResponsable = new AreaResponsableDTOV1().deserialize(record.areaResponsable);
        this.configGeneralData.areaResponsable = areaResponsable;
        this.dataTableEvidences = new MatTableDataSource<IndicadorEvidencia>([]);
        this.getAllComponentes();
        setTimeout(() => {
            this.indicadorSiacRecordForm.reset();
            this.displayFromConfigGeneral();
        }, 500);
    }

    addIndicador() {
        // Get información from From
        this.indicadorSiacRecordForm.markAllAsTouched();
        if (!this.indicadorSiacRecordForm.valid) {
            // console.log(this.indicadorSiacRecordForm.controls);
            Alert.error('Verifique que los campos sean correctos');
            return;
        }
        if (this.normativeSelectedList.length <= 0) {
            Alert.error('Debe seleccionar una Normativa');
            return;
        }
        if (this.dataTableEvidences.data.length <= 0) {
            Alert.error('Debe seleccionar una Evidencia');
            return;
        }
        clearForm(this.indicadorSiacRecordForm);
        const tmp = this.indicadorSiacRecordForm.getRawValue();
        const frmData = new ConfigIndicadoresFormDTOV1().deserialize(tmp);
        let recordData = new ConfigIndicadoresModel();
        recordData.cfgGeneralId = this.configGeneralData.id;
        recordData.cfgComponentesId = frmData.componente;
        recordData.cfgElementosEvaluacionId = frmData.elementoEvaluacion;
        recordData.indicadorSIACId = frmData.indicadorSIAC;
        recordData.normativas = this.normativeSelectedList.map((item) => item.id);
        recordData.evidencias = this.evidenceSelectedList.map((item) => item.id);
        recordData.areaCorporativaId = frmData.areaCorporativa;
        recordData.areasSubCorporativas = [];
        recordData.areasSubCorporativas = frmData.subAreasCorporativas.map((item) => item.id);
        recordData.componenteMiId = frmData.componenteMI;
        recordData.pilarestrategicoMiId = frmData.pilarEstrategico;
        recordData.indicadorMiId = frmData.indicadorMI;
        recordData.subIndicadorMiId = frmData.subIndicadorMI;
        recordData.activo = true;
        recordData.fechaCreacion = new Date();
        recordData.usuarioCreacion = this.users.userSession.id;

        let formData: FormData = new FormData();
        formData.append('entidad', JSON.stringify(recordData));
        if (this.evidenceFileList.length > 0) {
            this.evidenceFileList.forEach((element) => {
                if (element.formatoEvidencia != null) {
                    formData.append(
                        'files',
                        element.formatoEvidencia,
                        `FMTO_EVIDENCIA_${recordData.cfgGeneralId}_${recordData.cfgComponentesId}_${
                            recordData.cfgElementosEvaluacionId
                        }_${recordData.indicadorSIACId}_${element.evidencia.id}.${element.formatoEvidencia.name
                            .split('.')
                            .pop()}`
                    );
                }
            });
        }
        if (!this.editRecord) {
            this.serviceapiConfigIndicator.createConfigIndicador(formData).subscribe((response) => {
                if (response.exito) {
                    recordData = new ConfigIndicadoresModel().deserialize(response.output);
                    Alert.success('Se agregó la información seleccionada');
                    this.resetCampos();
                    this.getAllComponentes();
                    this.ref.detectChanges();
                } else Alert.warn(response.mensaje);
            });
        } else {
            this.serviceapiConfigIndicator.updatConfigIndicador(formData).subscribe((response) => {
                if (response.exito) {
                    recordData = new ConfigIndicadoresModel().deserialize(response.output);
                    Alert.success('Se agregó la información seleccionada');
                    this.resetCampos();
                    this.getAllComponentes();
                    this.ref.detectChanges();
                } else Alert.warn(response.mensaje);
            });
        }
    }

    getAllComponentes() {
        let filter = new TablePaginatorSearch();
        filter.pageNumber = 0;
        filter.pageSize = 1000;
        filter.filter = { CfgGeneralId: this.configGeneralData.id };
        this.serviceapiConfigIndicator.getAllConfigIndicador(filter).subscribe((response) => {
            if (response.output) {
                this.configGeneralData.configComponentes = response.output.map((data) =>
                    new ConfigComponentes().deserialize(data)
                );
                this.resetCampos();
                this.ref.detectChanges();
                this.displayFromConfigGeneral();
            }
        });
    }

    displayFromConfigGeneral() {
        let arr: dataTableComponentElements[] = [];
        this.configGeneralData.configComponentes.forEach((itemComp) => {
            itemComp.configElementosEvaluacion.forEach((itemEle) => {
                if (itemEle.configIndicadores) {
                    if (itemEle.configIndicadores.length > 0) {
                        itemEle.configIndicadores.forEach((itemIndicador) => {
                            let nuevoItem = new dataTableComponentElements();
                            nuevoItem.id = itemIndicador.id;
                            nuevoItem.cfgComponentesId = itemComp.id;
                            nuevoItem.configuracionGeneral = this.configGeneralData;
                            nuevoItem.elemento = itemEle;
                            nuevoItem.componente = itemComp.componente;
                            nuevoItem.indicador = itemIndicador.indicadorSiac;
                            nuevoItem.evidenciaIndicador = itemIndicador.configIndicadoresEvidencias;
                            nuevoItem.normativaIndicador = itemIndicador.configIndicadoresNormativas;
                            arr.push(nuevoItem);
                        });
                    }
                }
            });
        });

        this.dataTableComponentElements = new MatTableDataSource<dataTableComponentElements>([]);
        this.dataTableComponentElements.data = arr;
        this.dataTableEvidences = new MatTableDataSource<IndicadorEvidencia>([]);
        this.indicadorSiacRecordForm.get('formatoEvidencia').setValue(null);
        this.trackingStatusForm();
        this.ref.detectChanges();
    }

    componenteSeleccionado: any;
    onComponentChange(event: MatSelectChange): void {
        this.selectComponente(event.value);
    }

    onElementoChange(event: MatSelectChange): void {
        this.selectElemento(event.value);
    }

    indicadorSeleccionado: any;
    onIndicadoresSiacChange(event: MatSelectChange): void {
        this.selectIndicador(event.value);
    }

    existeIndicador(): boolean {
        let componente = this.configGeneralData.configComponentes.find(
            (item) => item.componenteId == this.componenteSeleccionado.id
        );
        if (!componente) return false;

        let elemento: ConfigElementosEvaluacion = componente.configElementosEvaluacion.find(
            (item) => item.elementoEvaluacionId == this.configElementosEvaluacionActual.id
        );
        if (!elemento) return false;

        let indicador = elemento.configIndicadores.find(
            (indicador) => indicador.indicadorSiacid == this.indicadorSeleccionado.id
        );
        if (!indicador) return false;

        Alert.warn('La selección ya existe en la configuración ');
        return true;
    }

    onChangeAreaCorporativa(event: MatSelectChange): void {
        this.subAreaCorpFilterList = this.subAreaCorpList.filter((item) => item.areaCentralId === event.value);
    }

    onComponentMiChange(event: MatSelectChange): void {
        this.indicatorMiSelList = [];
        this.subIndicatorMiSelList = [];
        this.indicadorSiacRecordForm.get('indicadorMI').setValue(null);
        this.indicadorSiacRecordForm.get('subIndicadorMI').setValue(null);
        this.indicatorMiSelList = this.indicatorMiList.filter((item) => item.componenteMiid == event.value);
    }

    onPilarEstrategicoMiChange(event: MatSelectChange): void {
        this.indicatorMiSelList = [];
        this.subIndicatorMiSelList = [];
        this.indicadorSiacRecordForm.get('indicadorMI').setValue(null);
        this.indicadorSiacRecordForm.get('subIndicadorMI').setValue(null);
        this.indicatorMiSelList = this.indicatorMiList.filter((item) => item.pilarEstrategicoMiid == event.value);
    }

    onIndicadorMiChange(event: MatSelectChange): void {
        this.subIndicatorMiSelList = [];
        this.indicadorSiacRecordForm.get('subIndicadorMI').setValue(null);
        this.subIndicatorMiSelList = this.subIndicatorMiList.filter((item) => item.indicadorMiid == event.value);
    }

    onSubAreaChange(event: MatSelectChange): void {
        this.subAreaCorpSelectList = event.value;
    }

    private GetAllList(filters: TablePaginatorSearch): void {
        this.GetAllSIACIndicator(filters);
        this.GetAllNormativeList(filters);
        this.GetAllEvidencesCatalogList(filters);

        this.GetAllareaCorpList(filters);
        this.GetAllSubAreaCorpList(filters);

        this.GetAllMiComponentList(filters);
        this.GetAllPilarEstrategico(filters);
        this.GetAllIndicadoresMI(filters);
        this.GetAllSubIndicadoresMI(filters);
    }

    private GetAllareaCorpList(filters: TablePaginatorSearch): void {
        this.serviceapiCorporateArea.getAllCorporateAreas(filters).subscribe((response) => {
            if (response.output) {
                this.areaCorpList = response.output.map((configuracion) =>
                    new AreaCorporativaDTOV1().deserialize(configuracion)
                );
            }
        });
    }

    private GetAllSubAreaCorpList(filters: TablePaginatorSearch): void {
        this.serviceapiCorporateSubArea.getAllCorporateSubAreas(filters).subscribe((response) => {
            if (response.output) {
                this.subAreaCorpList = response.output.map((configuracion) =>
                    new SubAreaCorporativaDTOV1().deserialize(configuracion)
                );
            }
        });
    }

    private GetAllSIACIndicator(filters: TablePaginatorSearch): void {
        this.serviceapiSiac.getAllIndicatorsSiac(filters).subscribe((response) => {
            if (response.output) {
                this.siacIndicatorList = response.output.map((configuracion) =>
                    new IndicadorSiacDTOV1().deserialize(configuracion)
                );
            }
        });
    }

    private GetAllMiComponentList(filters: TablePaginatorSearch): void {
        this.serviceapiComponenteMi.getAllComponentMi(filters).subscribe((response) => {
            if (response.output) {
                this.componenteMiList = response.output.map((item) => new ComponenteMIDTOV1().deserialize(item));
            }
        });
    }

    private GetAllPilarEstrategico(filters: TablePaginatorSearch): void {
        this.serviceapiPilarEstrategicoMi.getAllStrategicPillarMi(filters).subscribe((response) => {
            if (response.output) {
                this.pilarEstrategicoMiList = response.output.map((item) =>
                    new PilarEstrategicoMIDTOV1().deserialize(item)
                );
                this.pilarEstrategicoMiSelList = this.pilarEstrategicoMiList;
            }
        });
    }

    private GetAllIndicadoresMI(filters: TablePaginatorSearch): void {
        this.serviceapiIndicatorMi.getAllIndicatorMi(filters).subscribe((response) => {
            if (response.output) {
                this.indicatorMiList = response.output.map((item) => new IndicadorMIDTOV1().deserialize(item));
            }
        });
    }

    private GetAllSubIndicadoresMI(filters: TablePaginatorSearch): void {
        this.serviceapiSubIndicatorMi.getAllSubIndicatorMi(filters).subscribe((response) => {
            if (response.output) {
                this.subIndicatorMiList = response.output.map((item) => new SubIndicadorMIDTOV1().deserialize(item));
            }
        });
    }

    getIndicador(): ConfigIndicadores {
        try {
            return this.configuracionGeneral.configComponentes
                .find((com) => com.componenteId === this.componente.id)
                ?.configElementosEvaluacion.find(
                    (el) => el.elementoEvaluacionId === this.configElementosEvaluacionActual.elementoEvaluacionId
                )
                ?.configIndicadores.find((ind) => ind.indicadorSiacid === this.indicadorSeleccionado.id);
        } catch {
            return null;
        }
    }

    private GetAllNormativeList(filters: TablePaginatorSearch): void {
        this.serviceapiNormative.getAllNormatives(filters).subscribe((response) => {
            if (response.output) {
                this.normativeList = response.output.map((configuracion) =>
                    new NormativaDTOV1().deserialize(configuracion)
                );
                this.normativeToSelectList = this.normativeList;
            }
        });
    }

    private GetAllEvidencesCatalogList(filters: TablePaginatorSearch): void {
        this.serviceapiEvidencesCatalog.getAllEvidence(filters).subscribe((response) => {
            if (response.output) {
                this.evidenceCatalogList = response.output.map((configuracion) =>
                    new EvidenceDTO().deserialize(configuracion)
                );
                this.evidenceToSelectedList = this.evidenceCatalogList;
            }
        });
    }

    getEvidenciasList(evidenciasIndicador: IndicadorEvidencia[]): string {
        let template = `<h3>Evidencias Indicador</h3><table style="font-size: 12px !important; width: 100%"><thead><th>Clave</th><th>Nombre</th><th>Cantidad</th><th>Fmto</th></thead>`;
        evidenciasIndicador.forEach((item) => {
            template += `<tr>
            <td style="width: 10%;" align="center">${item.evidencia.clave}</td>
            <td style="width: 70%;" align="center">${item.evidencia.nombre}</td>
            <td style="width: 10%;" align="center">${item.evidencia.cantidad}</td>
            <td style="width: 10%;" align="center">`;
            if (item.archivoAzureId == null)
                template += `<button type="button" matTooltip="Sin formato de Evidencias">
                    <span class="mat-icon notranslate material-icons mat-icon-no-color disabled__icon">cloud_off</span>
                    </button>`;
            else
                template += `<button type="button" matTooltip="Descargar Archivo" onclick="javascript: window.location.href = '${environment.api}/ConfigIndicador/DownloadFormatoEvidencia/${item.archivoAzureId}';">
                    <span class="mat-icon notranslate material-icons mat-icon-no-color file__icon">cloud_download</span>
                    </button>`;
            template += `</td></tr>`;
        });
        template += `</table>`;
        return template;
    }

    closeModalByConfimation(): void {
        if (!this.edit) {
            this.hideMainConfig.emit(true);
            this.indicadorSiacRecordForm.reset();
            return;
        }
        Alert.confirm('Alerta', '¿Está seguro de que desea salir? Los datos ingresados no serán guardados.').subscribe(
            (result) => {
                if (!result || !result.isConfirmed) {
                    return;
                }
                this.hideMainConfig.emit(true);
                // this.generalConfigRecordForm.reset();
            }
        );
    }

    downloadFile(file: FileAzureDTOV1): void {
        this.serviceapiConfigIndicator
            .downloadAzureStorageFile(file.id)
            .subscribe((response) => saveAs(response, file.nombre));
    }

    DownloadFile(file: File): void {
        var reader = new FileReader();
        reader.readAsDataURL(file); // read file as data url
        reader.onload = (event) => {
            const blob = new Blob([event.target.result], { type: file.type });
            saveAs(blob, file.name);
        };
    }

    onDeleteIndicador(record: any) {
        Alert.confirm('Eliminar Indicador', `¿Deseas eliminar el Idicador SIAC de la configuración?`).subscribe(
            (result) => {
                if (!result || !result.isConfirmed) {
                    return;
                }
                let cfgComponenteId = record.cfgComponentesId;
                let elementoEvaluacionId = record.elemento.elementoEvaluacionId;
                let indicadorSIACId = record.indicador.id;
                this.serviceapiConfigIndicator
                    .deleteConfigIndicador(cfgComponenteId, elementoEvaluacionId, indicadorSIACId)
                    .subscribe((response) => {
                        this.indicadorSiacRecordForm.get('normativa').setValue(null);
                        this.indicadorSiacRecordForm.get('evidencia').setValue(null);
                        this.indicadorSiacRecordForm.get('formatoEvidencia').setValue(null);
                        this.indicadorSiacRecordForm.reset();
                        if (response.exito) {
                            Alert.success('', 'Indicador SIAC eliminado de la configuración correctamente');
                            this.getAllComponentes();
                        } else {
                            console.error(response.mensaje);
                            Alert.error('', 'No se puede eliminar el Indicador SIAC de la configuración');
                        }
                    });
            }
        );
    }

    onEditIndicador(record: dataTableComponentElements) {
        let cfgComponenteId = record.cfgComponentesId;
        let elementoEvaluacionId = record.elemento.elementoEvaluacionId;
        let indicadorSIACId = record.indicador.id;
        this.resetCampos();
        this.indicadorSiacRecordForm.get('componente').setValue(record.componente.id);
        this.indicadorSiacRecordForm.get('elementoEvaluacion').setValue(elementoEvaluacionId);
        this.indicadorSiacRecordForm.get('indicadorSIAC').setValue(indicadorSIACId);
        this.selectComponente(record.componente.id);
        this.selectElemento(elementoEvaluacionId);
        this.selectIndicador(indicadorSIACId);
        // Get by ID indicator with areas and evidence
        this.serviceapiConfigIndicator.getConfigIndicadorById(record.id).subscribe((response) => {
            if (response.exito) {
                // Fill form
                const data: ConfigIndicadorDTOV1 = new ConfigIndicadorDTOV1().deserialize(response.output);
                this.editRecord = true;

                // Indicador SIAC
                this.indicadorSiacRecordForm.get('areaCorporativa').setValue(data.areaCorporativaId);
                this.subAreaCorpFilterList = this.subAreaCorpList.filter(
                    (item) => item.areaCentralId === data.areaCorporativaId
                );
                this.subAreaCorpSelectList = data.subAreasCorporativas;
                this.indicadorSiacRecordForm.get('subAreasCorporativas').setValue(data.subAreasCorporativas);
                this.indicadorSiacRecordForm.get('componenteMI').setValue(data.componenteMiid);
                this.pilarEstrategicoMiSelList = this.pilarEstrategicoMiList;
                this.indicadorSiacRecordForm.get('pilarEstrategico').setValue(data.pilarEstrategicoMiid);
                this.indicatorMiSelList = this.indicatorMiList.filter(
                    (item) => item.pilarEstrategicoMiid == data.pilarEstrategicoMiid
                );
                this.indicadorSiacRecordForm.get('indicadorMI').setValue(data.indicadorMiid);
                this.subIndicatorMiSelList = this.subIndicatorMiList.filter(
                    (item) => item.indicadorMiid == data.indicadorMiid
                );
                this.indicadorSiacRecordForm.get('subIndicadorMI').setValue(data.subIndicadorMiid);
                this.indicadorSiacRecordForm.get('formatoEvidencia').setValue(null);

                this.indicadorSiacRecordForm.get('componente').disable();
                this.indicadorSiacRecordForm.get('elementoEvaluacion').disable();
                this.indicadorSiacRecordForm.get('indicadorSIAC').disable();

                // Normativas
                const normativas: NormativaDTOV1[] = [];
                data.configIndicadoresNormativas.forEach((item) => {
                    if (item.normativa) normativas.push(item.normativa);
                });
                const filtroNormativa = normativas.map((item) => item.id);
                this.normativeSelectedList = this.normativeList.filter((item) => filtroNormativa.includes(item.id));
                this.normativeToSelectList = this.normativeList.filter((item) => !filtroNormativa.includes(item.id));
                this.indicadorSiacRecordForm.get('normativa').setValue(null);

                // Evidencias
                const evidencias: EvidenceDTO[] = [];
                this.evidenceFileList = [];
                data.configIndicadoresEvidencias.forEach((item) => {
                    evidencias.push(item.evidencia);
                    const iEvidencia: IndicadorEvidencia = new IndicadorEvidencia();
                    iEvidencia.id = item.id;
                    iEvidencia.cfgIndicadorId = item.cfgIndicadorId;
                    iEvidencia.evidenciaId = item.evidenciaId;
                    iEvidencia.evidencia = item.evidencia;
                    iEvidencia.activo = item.activo;
                    iEvidencia.fechaCreacion = item.fechaCreacion;
                    iEvidencia.usuarioCreacion = item.usuarioCreacion;
                    if (item.archivoAzureId != null) {
                        iEvidencia.archivoAzure = null; //item.archivoAzure;
                        iEvidencia.archivoAzureId = item.archivoAzureId;
                        iEvidencia.formatoEvidencia = null;
                        this.serviceapiConfigIndicator
                            .downloadAzureStorageFile(iEvidencia.archivoAzureId)
                            .subscribe((response) => {
                                iEvidencia.formatoEvidencia = new File([response], item.archivoAzure.nombre);
                            });
                    } else {
                        iEvidencia.formatoEvidencia = null;
                        iEvidencia.archivoAzure = null;
                        iEvidencia.archivoAzureId = null;
                    }
                    setTimeout(() => {
                        this.evidenceFileList.push(iEvidencia);
                    }, 500);
                });
                setTimeout(() => {
                    this.dataTableEvidences = new MatTableDataSource<IndicadorEvidencia>(this.evidenceFileList);
                }, 500);

                this.evidenceSelectedList = evidencias;
                const filtroEvidencia = evidencias.map((item) => item.id);
                this.evidenceToSelectedList = this.evidenceCatalogList.filter(
                    (item) => !filtroEvidencia.includes(item.id)
                );
                this.indicadorSiacRecordForm.get('evidencia').setValue(null);
                this.trackingStatusForm();
                // this.dataTableEvidences = new MatTableDataSource<IndicadorEvidencia>(this.evidenceFileList);
                this.ref.detectChanges();
                //this.getAllRubricas(cfgComponenteId, elementoEvaluacionId, indicadorSIACId, data.id);
            } else {
                Alert.warn('No existe el registro seleccionado');
            }
        });
    }

    onCancelRecord() {
        if (!this.edit || !this.indicadorSiacRecordForm.dirty) return;
        Alert.confirm('Alerta', '¿Está seguro de que cancelar? Los datos ingresados no serán guardados.').subscribe(
            (result) => {
                if (!result || !result.isConfirmed) {
                    return;
                }
                this.resetCampos();
                //this.indicadorSiacRecordForm.reset();
            }
        );
    }

    resetCampos() {
        this.editRecord = false;
        this.dataSource = new MatTableDataSource<IndicadorSiacDTO>([]);
        //this.dataTableComponentElements = new MatTableDataSource<dataTableComponentElements>([]);
        this.dataTableEvidences = new MatTableDataSource<IndicadorEvidencia>([]);
        this.evidenceFileList = [];
        this.evidenceSelectedList = [];
        this.evidenceToSelectedList = this.evidenceCatalogList;
        this.normativeSelectedList = [];
        this.normativeToSelectList = this.normativeList;
        this.indicadorSiacRecordForm.get('formatoEvidencia').setValue(null);
        this.indicadorSiacRecordForm.get('componente').setValue(null);
        this.indicadorSiacRecordForm.get('elementoEvaluacion').setValue(null);
        this.indicadorSiacRecordForm.get('indicadorSIAC').setValue(null);
        this.indicadorSiacRecordForm.get('areaCorporativa').setValue(null);
        this.indicadorSiacRecordForm.get('subAreasCorporativas').setValue(null);
        this.indicadorSiacRecordForm.get('componenteMI').setValue(null);
        this.indicadorSiacRecordForm.get('pilarEstrategico').setValue(null);
        this.indicadorSiacRecordForm.get('indicadorMI').setValue(null);
        this.indicadorSiacRecordForm.get('subIndicadorMI').setValue(null);
        this.indicadorSiacRecordForm.get('normativa').setValue(null);
        this.indicadorSiacRecordForm.get('evidencia').setValue(null);
        this.indicadorSiacRecordForm.get('componente').enable();
        this.indicadorSiacRecordForm.get('elementoEvaluacion').enable();
        this.indicadorSiacRecordForm.get('indicadorSIAC').enable();
    }

    selectComponente(id: number): void {
        const componentes: ConfigComponentes[] = this.configGeneralData.configComponentes.map((item) =>
            new ConfigComponentes().deserialize(item)
        );
        const componente: ConfigComponentes = componentes.find((item) => item.componenteId == id);
        this.configElementosEvaluacionSeleccionados = componente.configElementosEvaluacion;
        this.componenteSeleccionado = componente;
        this.configElementosEvaluacionActual = null;
        this.indicadorSeleccionado = null;
    }

    selectElemento(id: number): void {
        this.siacIndicatorSelectedList = this.siacIndicatorList.filter(
            (indicador) => indicador.elementoEvaluacionId === id
        );
        this.configElementosEvaluacionActual = this.configElementosEvaluacionSeleccionados.find(
            (item) => item.elementoEvaluacionId == id
        );
        this.indicadorSeleccionado = null;
    }

    selectIndicador(id: number): void {
        this.indicadorSeleccionado = id;
        if (this.existeIndicador()) {
            this.indicadorSeleccionado = null;
            this.indicadorSiacRecordForm.get('indicadorSIAC').patchValue(null);
        }
    }

    compareItems(i1: any, i2: any) {
        return i1 && i2 && i1.id === i2.id;
    }

    private trackingStatusForm(): void {
        this.subscription.add(this.indicadorSiacRecordForm.statusChanges.subscribe(() => (this.edit = true)));
    }

    addNormativa(event: MatChipInputEvent): void {
        const value = (event.value || '').trim();
        let valor = this.normativeToSelectList.find((item) => item.nombre.toLowerCase() == value.toLowerCase());
        if (valor) {
            this.normativeSelectedList.push(valor);
            this.filteredNormativa();
        }
        // Clear the input value
        event.chipInput!.clear();
        this.indicadorSiacRecordForm.get('normativa').setValue(null);
    }

    removeNormativa(valor: NormativaDTOV1): void {
        const select = this.normativeSelectedList.filter((item) => item.id !== valor.id);
        this.normativeSelectedList = select;
        this.filteredNormativa();
    }

    selectedNormativa(event: MatAutocompleteSelectedEvent): void {
        let valor = this.normativeToSelectList.find(
            (item) => item.nombre.toLowerCase() == event.option.value.toLowerCase()
        );
        this.normativeSelectedList.push(valor);
        this.filteredNormativa();
    }

    async filteredNormativa() {
        if (this.normativeSelectedList.length > 0) {
            const selected = this.normativeSelectedList.map((item) => item.id);
            this.normativeToSelectList = this.normativeList.filter((item) => !selected.includes(item.id));
        } else {
            this.normativeToSelectList = this.normativeList;
        }
        // Clear the input value
        this.normativaInput.nativeElement.value = '';
        this.indicadorSiacRecordForm.get('normativa').setValue(null);
    }

    onAddEvidencia() {
        // this.dataTableEvidences = new MatTableDataSource<IndicadorEvidencia>([]);
        const evidencia: IndicadorEvidencia = new IndicadorEvidencia();
        const evidenciaNombre = this.indicadorSiacRecordForm.get('evidencia').value;
        let index = 0;
        evidencia.id = null;
        evidencia.cfgIndicadorId = null;
        evidencia.evidencia = this.evidenceToSelectedList.find((item) => item.nombre == evidenciaNombre);
        evidencia.evidenciaId = evidencia.evidencia.id;
        const files: any[] = this.indicadorSiacRecordForm.get('formatoEvidencia').value;
        if (files && files.length > 0) {
            evidencia.formatoEvidencia = files[0];
            index = this.evidenceFileList.find((item) =>
                item.formatoEvidencia ? item.formatoEvidencia.name == evidencia.formatoEvidencia.name : false
            )
                ? 0
                : -1;
        } else {
            evidencia.formatoEvidencia = null;
            index = -1;
        }
        evidencia.archivoAzure = null;
        evidencia.archivoAzureId = null;
        evidencia.activo = true;
        evidencia.fechaCreacion = new Date();
        evidencia.usuarioCreacion = this.users.userSession.id;
        // validar si existe el archivo
        if (index == -1) {
            this.evidenceFileList.push(evidencia);
            this.dataTableEvidences.data = this.evidenceFileList;
            this.evidenceSelectedList.push(evidencia.evidencia);
            const filtroEvidencia = this.evidenceSelectedList.map((item) => item.id);
            this.evidenceToSelectedList = this.evidenceCatalogList.filter((item) => !filtroEvidencia.includes(item.id));
        } else {
            Alert.warn('Ya existe un Formato de Evidencia con el mismo nombre');
        }
        this.indicadorSiacRecordForm.get('evidencia').setValue(null);
        this.indicadorSiacRecordForm.get('formatoEvidencia').setValue(null);
    }

    onCancel() {
        this.indicadorSiacRecordForm.get('evidencia').setValue(null);
        this.indicadorSiacRecordForm.get('formatoEvidencia').setValue(null);
    }

    onDeleteEvidencia(row: IndicadorEvidencia) {
        Alert.confirm('Eliminar la Evidencia', `¿Deseas eliminar la Evidencia de la configuración?`).subscribe(
            (result) => {
                if (!result || !result.isConfirmed) {
                    return;
                }
                this.evidenceFileList = this.evidenceFileList.filter((item) => item.evidenciaId != row.evidenciaId);
                this.dataTableEvidences = new MatTableDataSource<IndicadorEvidencia>([]);
                this.dataTableEvidences.data = this.evidenceFileList;
                this.evidenceSelectedList = this.evidenceSelectedList.filter((item) => item.id != row.evidencia.id);
                const filtroEvidencia = this.evidenceSelectedList.map((item) => item.id);
                this.evidenceToSelectedList = this.evidenceCatalogList.filter(
                    (item) => !filtroEvidencia.includes(item.id)
                );
                this.indicadorSiacRecordForm.get('evidencia').setValue(null);
            }
        );
    }
}
