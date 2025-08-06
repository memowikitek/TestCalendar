import { SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { GeneralConfigurationService, UsersService } from 'src/app/core/services';
import { Alert } from 'src/app/utils/helpers';
import { ConfNivelAreaResponsableDTO, TablePaginatorSearch } from 'src/app/utils/models';
import { ConfigGeneralComponent } from '../config-tabs/config-general/config-general.component';
import { ConfigElementsComponent } from './config-elements/config-elements.component';
import { ConfigIndicatorsComponent } from './config-indicators/config-indicators.component';
import { ConfigRubricaComponent } from './config-rubrica/config-rubrica.component';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ConfiguracionGeneral } from 'src/app/utils/models/configuracion-general';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
    selector: 'app-general-config',
    templateUrl: './general-config.component.html',
    styleUrls: ['./general-config.component.scss'],
})
export class GeneralConfigComponent implements OnInit {
    @ViewChild('input', { static: true }) inputSearch: ElementRef;
    @ViewChild('paginator', { static: true }) readonly paginator: MatPaginator;

    @ViewChild(ConfigGeneralComponent) configGeneral: ConfigGeneralComponent;
    @ViewChild(ConfigElementsComponent) configElement: ConfigElementsComponent;
    @ViewChild(ConfigIndicatorsComponent) configIndicator: ConfigIndicatorsComponent;
    @ViewChild(ConfigRubricaComponent) configRubrica: ConfigRubricaComponent;

    data: ConfNivelAreaResponsableDTO[];
    dataSource: MatTableDataSource<ConfNivelAreaResponsableDTO>;
    selection: SelectionModel<ConfNivelAreaResponsableDTO>;
    disabled: boolean;
    configGral: ConfiguracionGeneral;

    isHiddenConfig: boolean;

    initConfig: boolean;
    initElements: boolean;
    initIndicators: boolean;
    initRubrica: boolean;

    isDisabledElements: boolean;
    isDisabledIndicators: boolean;
    isDisabledRubrica: boolean;

    permission: boolean;
    filters: TablePaginatorSearch;
    pageIndex: number;
    pageSize: number;
    length: number;
    private searchsub$ = new Subject<string>();
    constructor(private readonly generalConfiguration: GeneralConfigurationService, private users: UsersService) {
        this.data = [];
        this.dataSource = new MatTableDataSource<ConfNivelAreaResponsableDTO>([]);
        this.selection = new SelectionModel<ConfNivelAreaResponsableDTO>(true);
        this.disabled = null;
        this.permission = null;
        this.filters = new TablePaginatorSearch();
        this.configGral = null;
    }

    ngOnInit(): void {
        this.isHiddenConfig = true;

        this.initConfig = false;
        this.initElements = false;
        this.initIndicators = false;
        this.initRubrica = false;

        this.isDisabledElements = false;
        this.isDisabledIndicators = false;
        this.isDisabledRubrica = false;

        this.pageSize = 25;
        this.pageIndex = this.filters.pageNumber;
        this.filters.pageSize = 25;
        this.filters.filter = {};
        this.getAllGeneralConfiguration(this.filters);
        this.searchsub$.pipe(debounceTime(500), distinctUntilChanged()).subscribe((filtervalue: string) => {
            this.filters.filter = {
                periodoEvaluacionId: !!Number(filtervalue) ? parseInt(filtervalue) : null,
                ciclo: filtervalue.trim().toLowerCase() != '' ? filtervalue.trim().toLowerCase() : null,
                anio: !!Number(filtervalue) ? parseInt(filtervalue) : null,
                institucion: filtervalue.trim().toLowerCase() != '' ? filtervalue.trim().toLowerCase() : null,
            };
            this.filters.pageNumber = 0;
            this.pageIndex = this.filters.pageNumber;
            this.getAllGeneralConfiguration(this.filters);
        });
    }

    edit(record: ConfNivelAreaResponsableDTO): void {
        this.isHiddenConfig = false;
        if (!this.isHiddenConfig) {
            this.configGeneral.initConfig = true;

            this.isDisabledElements = false;
            this.isDisabledIndicators = false;
            this.isDisabledRubrica = false;

            this.generalConfiguration.getGeneralConfigurationById(record.id).subscribe((response: any) => {
                if (response.output) {
                    record = response.output;
                    this.configGral = response.output;
                    // general
                    this.configGeneral.tabInit(response.output);
                    // componentes y elementos de evaluacion
                    this.configElement.tabInit(this.configGral);
                    // indicadores
                    this.configIndicator.tabInit(this.configGral);
                    // Rubrica Evaluación
                    this.configRubrica.tabInit(this.configGral);
                }
            });
        }
    }

    paginatorChange(event: PageEvent): void {
        this.filters.pageSize = event.pageSize;
        this.filters.pageNumber = event.pageIndex;
        this.getAllGeneralConfiguration(this.filters);
    }

    disable(data: ConfNivelAreaResponsableDTO): void {
        const msg = `Configuración General ${data.activo ? 'inactivado' : 'activado'} correctamente`;
        this.generalConfiguration.disableGeneralConfiguration(data.id, !data.activo).subscribe((response) => {
            if (response.exito) {
                Alert.success('', msg);
                this.getAllGeneralConfiguration(this.filters);
            } else {
                console.error(response.mensaje);
                Alert.error('', `No se puede ${!data.activo ? 'Deshabilitar' : 'Habilitar'} la Configuración General`);
            }
        });
    }

    delete(configuracionGeneral: ConfNivelAreaResponsableDTO): void {
        Alert.confirm('Eliminar configuración', `¿Deseas eliminar la configuración?`).subscribe((result) => {
            if (!result || !result.isConfirmed) {
                return;
            }
            this.generalConfiguration.deleteGeneralConfiguration(configuracionGeneral.id).subscribe((response) => {
                if (response.exito) {
                    Alert.success('', 'Configuración General eliminada correctamente');
                    this.getAllGeneralConfiguration(new TablePaginatorSearch());
                } else {
                    console.error(response.mensaje);
                    Alert.error('', 'No se puede eliminar la Configuración General');
                }
            });
        });
    }

    // applyFilter(event: Event) {
    //     const filterValue = (event.target as HTMLInputElement).value;
    //     if (filterValue.length > 1 || filterValue.length == 0) {
    //         this.filters.filter = {
    //             anio: parseInt(filterValue),
    //             nombre: filterValue.trim().toLowerCase(),
    //             areaResponsable: { nombre: filterValue.trim().toLowerCase() },
    //             periodoEvaluacion: { institucion: { nombre: filterValue.trim().toLowerCase() } },
    //             nivelModalidad: { clave: filterValue.trim().toLowerCase() },
    //         };
    //         this.filters.pageNumber = 0;
    //         this.pageIndex = this.filters.pageNumber;
    //         this.getAllGeneralConfiguration(this.filters);
    //         this.dataSource.filter = filterValue.trim().toLowerCase();
    //     }
    // }

    getAllGeneralConfiguration(filters: TablePaginatorSearch): void {
        this.dataSource.data = [];
        this.data = [];
        this.generalConfiguration.getAllGeneralConfigurations(filters).subscribe((response) => {
            if (response.output) {
                this.data = response.output.map((configuracion) =>
                    new ConfNivelAreaResponsableDTO().deserialize(configuracion)
                );
                this.dataSource.data = this.data;
                this.pageIndex = response.paginacion.pagina;
                this.pageSize = response.paginacion.registros;
                this.length = response.paginacion.count;
            }
        });
    }

    getAllGeneralConfigurationsExcel(): void {
        // this.generalConfiguration.getAllGeneralConfigurationsExcel(this.filters).subscribe((response) => {
        //     if (response.success) {
        //         convertByteArrayToBlob(response.data, response.mime, response.name);
        //     }
        // });
    }

    createNew(hide: boolean): void {
        this.isHiddenConfig = hide;
        if (!this.isHiddenConfig) {
            this.configGeneral.initConfig = true;
            this.isDisabledElements = true;
            this.isDisabledIndicators = true;
            this.isDisabledRubrica = true;
            this.configGeneral.tabInit(null);
        }
    }

    openGeneralConfiguration(hide: boolean): void {
        this.isHiddenConfig = hide;
        if (hide) {
            this.getAllGeneralConfiguration(this.filters);
        }
    }

    onTabChanged(event: MatTabChangeEvent) {
        switch (event.index) {
            case 1:
                // componentes y elementos de evaluacion
                this.configElement.tabInit(this.configGral);
                break;
            case 2:
                // indicadores
                this.configIndicator.tabInit(this.configGral);
                break;
            case 3:
                // Rubrica Evaluación
                this.configRubrica.tabInit(this.configGral);
                break;
        }
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.searchsub$.next(filterValue);
    }
}
