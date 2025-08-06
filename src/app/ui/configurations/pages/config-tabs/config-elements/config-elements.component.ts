import { ChangeDetectorRef, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSelectChange } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import {
    ComponentsService,
    ConfigComponentEvaluationElementService,
    EvaluationElementCatalogService,
    GeneralConfigurationService,
    UsersService,
} from 'src/app/core/services';
import { Alert } from 'src/app/utils/helpers';
import { ResponseV1 } from 'src/app/utils/interfaces';
import {
    AreaResponsableDTOV1,
    CatalogoElementoEvaluacionDTOV1,
    ComponenteDTOV1,
    ConfigElementosEvaluacionDTOV1,
    TablePaginatorSearch,
} from 'src/app/utils/models';
import { ConfigComponentes } from 'src/app/utils/models/config-componentes';
import { ConfigElementosEvaluacion } from 'src/app/utils/models/config-elementos-evaluacion';
import { ConfiguracionGeneral } from 'src/app/utils/models/configuracion-general';
import { ModalTitle } from '../config-general/config-general.component';

@Component({
    selector: 'app-config-elements',
    templateUrl: './config-elements.component.html',
    styleUrls: ['./config-elements.component.scss'],
})
export class ConfigElementsComponent implements OnInit {
    @Output() hideMainConfig = new EventEmitter<boolean>();
    configGeneralData = new ConfiguracionGeneral();
    edit: boolean;
    subscription: Subscription;

    [x: string]: any;
    @ViewChild('input', { static: true }) inputSearch: ElementRef;
    @ViewChild('paginator', { static: true }) readonly paginator: MatPaginator;
    componentList: ComponenteDTOV1[];
    componentSelectedList: ComponenteDTOV1[];
    selectedComponent: ComponenteDTOV1;
    elementSelectedList: CatalogoElementoEvaluacionDTOV1[];
    selectedElements: CatalogoElementoEvaluacionDTOV1[] = [];
    selectedElementsIndicador: ConfigElementosEvaluacion[] = [];
    catalogElementList: CatalogoElementoEvaluacionDTOV1[] = [];
    disabled: boolean;
    componentId = 0;
    open: boolean;
    isEdit: boolean = false;

    selectedComponentElement = new ConfiguracionGeneral();
    dataSourceTable: MatTableDataSource<ConfigComponentes>;
    pageIndex: number;
    pageSize: number;
    length: number;
    filters: TablePaginatorSearch;
    title: ModalTitle;
    elementsRecordForm: FormGroup;

    constructor(
        private readonly formBuilder: FormBuilder,
        private serviceapiComponent: ComponentsService,
        private serviceapiEvaluationElementCatalog: EvaluationElementCatalogService,
        private serviceapiConfigComponentEvaluationElement: ConfigComponentEvaluationElementService,
        private ref: ChangeDetectorRef,
        private users: UsersService
    ) {
        this.edit = null;
        this.subscription = new Subscription();
        this.initSelectedValues();
        this.filters = new TablePaginatorSearch();
        this.elementsRecordForm = this.formBuilder.group({
            componente: [null, [Validators.required]],
            elementos: [null, [Validators.required]],
        });
    }

    ngOnInit() {
        this.open = false;
        this.componentList = [];
        this.componentSelectedList = [];
        this.dataSourceTable = new MatTableDataSource<ConfigComponentes>([]);

        this.filters = new TablePaginatorSearch();
        this.pageSize = 5;
        this.pageIndex = 0;
        this.filters.pageSize = 1000;
        this.filters.filter = {};
        this.getAllComponentsAndElements(this.filters);
        this.edit = true;

        if (!this.selectedComponentElement.configComponentes) {
            this.selectedComponentElement.configComponentes = [];
            let newconfigComp = new ConfigComponentes();
            newconfigComp.componente = new ComponenteDTOV1();
            this.selectedComponentElement.configComponentes.push(newconfigComp);
            this.selectedComponentElement.configComponentes[0].configElementosEvaluacion = [];
        }
    }

    submit(): void {}

    private getAllComponentsAndElements(filters: TablePaginatorSearch): void {
        this.serviceapiComponent.getAllComponents(filters).subscribe((response) => {
            if (response.output) {
                this.componentList = response.output.map((configuracion) =>
                    new ComponenteDTOV1().deserialize(configuracion)
                );
                this.componentSelectedList = [];
            }
        });

        let filtersCompElement: TablePaginatorSearch;
        filtersCompElement = new TablePaginatorSearch();
        filtersCompElement.pageNumber = 0;
        filtersCompElement.pageSize = 1000;
        this.serviceapiEvaluationElementCatalog
            .getAllEvaluationElementsCatalogs(filtersCompElement)
            .subscribe((response) => {
                if (response.output) {
                    this.catalogElementList = response.output.map((configuracion) =>
                        new CatalogoElementoEvaluacionDTOV1().deserialize(configuracion)
                    );
                    this.selectedElements = response.output.map((configuracion) =>
                        new CatalogoElementoEvaluacionDTOV1().deserialize(configuracion)
                    );
                }
            });
    }

    paginatorChange(event: PageEvent): void {
        this.filters.pageSize = event.pageSize;
        this.filters.pageNumber = event.pageIndex;
        this.getAllComponentsAndElements(this.filters);
    }

    closeModalByConfimation(): void {
        if (!this.edit) {
            this.hideMainConfig.emit(true);
            this.generalConfigRecordForm.reset();
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

    configuracionGeneral = new ConfiguracionGeneral();
    tabInit(record: ConfiguracionGeneral): void {
        //Todo: agregar el listado de componentes que ya trae la configuracion general desde el primer query debe de ser un array de este modelo ConfigElementosEvaluacionDTOV1
        // para descomentarcodigo de asignacion a la tabla princioal importante debe tener el configComponentesId para poder eliminar
        this.configuracionGeneral = record;
        this.configGeneralData = record;
        this.componentSelectedList = [];
        this.elementSelectedList = [];
        this.selectedComponent = null;
        this.isEdit = false;
        if (record.configComponentes) {
            this.dataSourceTable = new MatTableDataSource<ConfigComponentes>([]);
            this.dataSourceTable.data = record.configComponentes;
            this.elementsRecordForm.reset();
            this.trackingStatusForm();
            this.ref.detectChanges();
        }

        let areaResponsable = new AreaResponsableDTOV1().deserialize(record.areaResponsable);
        this.configGeneralData.areaResponsable = areaResponsable;
    }

    onSelectedComponent(event: MatSelectChange): void {
        this.selectedComponent = event.value;
        this.elementSelectedList = [];
        this.elementSelectedList = this.catalogElementList.filter(
            (elemento) => elemento.componenteId === event.value.id
        );
    }

    onSelectedElements(event: MatSelectChange): void {
        // this.selectedElements = [];
        this.selectedElements = event.value || [];
        this.elementsRecordForm.get('elementos').setValue(this.selectedElements);
        this.trackingStatusForm();
    }

    compareItems(i1: any, i2: any) {
        return i1 && i2 && i1.id === i2.id;
    }

    TieneIndicadores(element: CatalogoElementoEvaluacionDTOV1) {
        let elemento = this.selectedElementsIndicador.filter((item) => item.elementoEvaluacionId == element.id);
        if (elemento.length > 0) {
            if (elemento[0].configIndicadores) {
                return elemento[0].configIndicadores.length > 0;
            }
        }
        return false;
    }

    currentConfigComponentesId = 0;
    onAddComponentAndElement() {
        if (this.elementSelectedList.length <= 0) {
            Alert.warn('Debe seleccionar al menos un Elemento de Evaluación');
            return;
        }

        Alert.confirm('Información', '¿Desea guardar esta información en la configuracion?').subscribe((result) => {
            if (!result || result.isConfirmed) {
                let newconfigElementosEvaluacion = new ConfigComponentes();
                let err = 0;
                const componente = this.selectedComponent;
                newconfigElementosEvaluacion = new ConfigComponentes();
                newconfigElementosEvaluacion.configGeneralId = this.configuracionGeneral.id;
                newconfigElementosEvaluacion.componenteId = componente.id;
                newconfigElementosEvaluacion.activo = true;
                newconfigElementosEvaluacion.fechaCreacion = new Date();
                newconfigElementosEvaluacion.usuarioCreacion = this.users.userSession.id;
                newconfigElementosEvaluacion.elementosEvaluacion = [];
                newconfigElementosEvaluacion.componente = componente;
                if (this.isEdit) {
                    let elementos = this.selectedElements.filter((elemento) => elemento.componenteId === componente.id);
                    elementos.forEach((element: CatalogoElementoEvaluacionDTOV1) => {
                        let configElement = new ConfigElementosEvaluacion();
                        configElement.configGeneralId = this.configuracionGeneral.id;
                        configElement.elementoEvaluacionId = element.id;
                        configElement.elementoEvaluacion = element;
                        let elemento = this.selectedElementsIndicador.filter(
                            (item) => item.elementoEvaluacionId == element.id
                        );
                        if (elemento.length <= 0) {
                            newconfigElementosEvaluacion.configElementosEvaluacion.push(configElement);
                            newconfigElementosEvaluacion.elementosEvaluacion.push(element.id);
                        } else {
                            if (elemento[0].configIndicadores) {
                                if (elemento[0].configIndicadores.length <= 0) {
                                    newconfigElementosEvaluacion.configElementosEvaluacion.push(configElement);
                                    newconfigElementosEvaluacion.elementosEvaluacion.push(element.id);
                                }
                            } else {
                                newconfigElementosEvaluacion.configElementosEvaluacion.push(configElement);
                                newconfigElementosEvaluacion.elementosEvaluacion.push(element.id);
                            }
                        }
                    });
                } else {
                    let elementos = this.selectedElements.filter((elemento) => elemento.componenteId === componente.id);
                    elementos.forEach((element: CatalogoElementoEvaluacionDTOV1) => {
                        let configElement = new ConfigElementosEvaluacion();
                        configElement.configGeneralId = this.configuracionGeneral.id;
                        configElement.elementoEvaluacionId = element.id;
                        configElement.elementoEvaluacion = element;
                        newconfigElementosEvaluacion.configElementosEvaluacion.push(configElement);
                        newconfigElementosEvaluacion.elementosEvaluacion.push(element.id);
                    });
                }
                // Add Componente with Elementos Evaluacion
                this.serviceapiConfigComponentEvaluationElement
                    .createComponent(newconfigElementosEvaluacion)
                    .subscribe((response) => {
                        if (response.exito) {
                            Alert.success(`Se ha agregado la información seleccionada`);
                            this.componentSelectedList = [];
                            this.elementSelectedList = [];
                            this.selectedComponent = null;
                            this.elementsRecordForm.reset();
                            this.isEdit = false;
                            this.getAllComponentes(this.configuracionGeneral.id);
                            this.ref.detectChanges();
                        } else Alert.error(`Existen errores al guardar la información seleccionada`);
                    });
            }
        });
    }

    onCancel() {
        this.elementsRecordForm.reset();
        this.trackingStatusForm();
        this.ref.detectChanges();
    }

    getAllComponentes(configId: number) {
        this.filters.filter = { configGeneralId: configId };
        this.serviceapiConfigComponentEvaluationElement.getAllComponents(this.filters).subscribe((response) => {
            if (response.output) {
                const data = response.output.map((item) => new ConfigComponentes().deserialize(item));
                this.dataSourceTable.data = data;
                this.configuracionGeneral.configComponentes = data;
                this.ref.detectChanges();
            } else {
                Alert.error(response.mensaje);
            }
        });
    }

    initSelectedValues() {}

    onDelete(row: ConfigComponentes) {
        this.componentSelectedList = [];
        this.elementSelectedList = [];
        this.selectedComponentElement.configComponentes = [];
        Alert.confirm('Información', '¿Desea eliminar este componente de la configuración?.').subscribe((result) => {
            if (!result || result.isConfirmed) {
                this.serviceapiConfigComponentEvaluationElement.deleteComponent(row.id).subscribe((response: any) => {
                    if (response.exito) {
                        Alert.success(`Se ha eliminado la información seleccionada`, 'Eliminado');
                        this.elementsRecordForm.reset();
                        this.getAllComponentes(this.configuracionGeneral.id);
                        this.ref.detectChanges();
                    }
                });
            }
        });
    }

    onEdit(row: ConfigComponentes) {
        this.componentSelectedList = [];
        this.elementSelectedList = [];
        this.selectedElements = [];
        this.elementsRecordForm.reset();
        this.selectedComponent = new ComponenteDTOV1().deserialize(row.componente);
        this.componentSelectedList.push(this.selectedComponent);
        this.elementSelectedList = this.catalogElementList.filter(
            (elemento) => elemento.componenteId === this.selectedComponent.id
        );
        this.selectedElementsIndicador = row.configElementosEvaluacion.map((item) =>
            new ConfigElementosEvaluacion().deserialize(item)
        );
        this.selectedElements = row.configElementosEvaluacion.map((item) =>
            new CatalogoElementoEvaluacionDTOV1().deserialize(item.elementoEvaluacion)
        );
        this.elementsRecordForm
            .get('componente')
            .setValue(this.selectedComponent, { onlySelf: true, emitEvent: false });
        this.elementsRecordForm.get('elementos').setValue(this.selectedElements);
        this.isEdit = true;
        this.trackingStatusForm();
        this.ref.detectChanges();
    }

    private trackingStatusForm(): void {
        this.subscription.add(this.elementsRecordForm.statusChanges.subscribe(() => (this.edit = true)));
    }
}
