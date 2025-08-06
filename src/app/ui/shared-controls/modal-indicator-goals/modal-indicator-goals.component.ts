import { AfterViewInit, ChangeDetectorRef, Component, Inject, OnInit, Input } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { map } from 'rxjs/operators';
import { ConfiguracionGeneral } from 'src/app/utils/models/configuracion-general';
import { MetasIndicadoresCapturaDTO } from 'src/app/utils/models/metas-indicadores-captura-dto';
import { Observable } from 'rxjs';
import { AreaResponsableDTOV1, NivelModalidadDTOV1, PeriodoEvaluacionDTOV1 } from 'src/app/utils/models';
import { MetasAreaResponsableService } from 'src/app/core/services/api/metas-area-responsable/metas-area-responsable.service';
import { ResponseV1 } from 'src/app/utils/interfaces';
import { Alert, AlertConfig, AlertExtendedConfig, Auth } from 'src/app/utils/helpers';
// import { ProfileData } from '../../catalogs/pages/profiles/modals/profile-record/profile-record.service';
@Component({
    selector: 'app-modal-indicator-goals',
    templateUrl: './modal-indicator-goals.component.html',
    styleUrls: ['./modal-indicator-goals.component.scss'],
})
export class ModalIndicatorGoalsComponent implements OnInit {
    @Input() metasIndicadores: any;
    configGeneralInfo: ConfiguracionGeneral;
    dataRow: any;
    metasIndicadoresCapturaDTO: MetasIndicadoresCapturaDTO[];
    form: FormGroup;
    configGeneralId: number;
    Autorizador: boolean = false;
    isAdmin: boolean;
    puedeCapturar = false;
    puedeCapturarAdmnin = false;
    areaConsolidada: boolean = false;
    constructor(
        private readonly _formBuilder: FormBuilder,
        private ref: ChangeDetectorRef,
        public dialogRef: MatDialogRef<ModalIndicatorGoalsComponent>,
        private metasAreaResponsableApi: MetasAreaResponsableService,
        @Inject(MAT_DIALOG_DATA) public dataIndicator: any // public readonly profileData: ProfileData
    ) {
        this.dataRow = dataIndicator.data;
        this.puedeCapturar = dataIndicator.data.puedeCapturar;
        this.puedeCapturarAdmnin = dataIndicator.data.puedeCapturarAdmin;

        this.configGeneralId = this.dataIndicator.data.cfgGeneralId;
        this.metasIndicadores = dataIndicator.data;
        this.metasIndicadores.metasIndicador = [];
        this.configGeneralInfo = new ConfiguracionGeneral();

        this.configGeneralInfo.periodoEvaluacion = new PeriodoEvaluacionDTOV1();
        this.configGeneralInfo.periodoEvaluacionId = this.metasIndicadores.periodoEvaluacionId;
        this.configGeneralInfo.periodoEvaluacion.anio = this.metasIndicadores.anio;
        this.configGeneralInfo.periodoEvaluacion.ciclo = this.metasIndicadores.ciclo;
        this.configGeneralInfo.periodoEvaluacion.institucion = this.metasIndicadores.institucion;
        this.configGeneralInfo.areaResponsable = new AreaResponsableDTOV1();
        this.configGeneralInfo.areaResponsable.nombre = this.dataRow.areaResponsable;
        this.configGeneralInfo.areaResponsable.tipoArea = this.metasIndicadores.tipoArea;

        // this.configGeneralInfo.areaResponsable = this.metasIndicadores.areaResponsable;
        this.configGeneralInfo.nivelModalidad = new NivelModalidadDTOV1();
        this.configGeneralInfo.nivelModalidad.niveles = this.metasIndicadores.niveles;
        this.configGeneralInfo.nivelesModalidad = this.dataRow.nivelesModalidad;

        // Validar tipo de Usuario
        this.isAdmin = Auth.getSession().esAdmin;
        if (!this.isAdmin) {
            // Valida si puede capturar
            if (!this.puedeCapturar) {
                if (dataIndicator.data.fechaActual < dataIndicator.data.fechaInicio)
                    Alert.warn('', `Aun no inicia la etapa de captura de metas y solo se pueden consultar`);
                else Alert.warn('', `La etapa de captura de metas ya concluyó y solo se pueden consultar`);
            }

            // Validar la Consolidacion
            var areasUsuario = Auth.getSession().areaResponsables;
            var areaConsolidada = areasUsuario.find((item) => item.id == dataIndicator.data.areaResponsableId);
            if (areaConsolidada) {
                if (areaConsolidada.consolidacion) {
                    Alert.warn('', `Este registro pertenece a un Área consolidada y solo se puede consultar`);
                    this.puedeCapturar = false;
                }
            }
        } else {
            // Validar si el registro esta dentro del reango de fecha del Periodo
            console.log(dataIndicator.data);
            this.puedeCapturar = this.puedeCapturarAdmnin;
        }
    }

    ngOnInit(): void {
        this.Autorizador = Auth.getSession().esAutorizador;
        this.form = this._formBuilder.group({
            elementos: this._formBuilder.array([]),
        });
        this.obtenerListaElementos();
    }

    get elementos(): FormArray {
        return this.form.get('elementos') as FormArray;
    }

    onViewMi(event: any) {
        let rowData = event as FormControl;
        var metaCapturada: MetasIndicadoresCapturaDTO = JSON.parse(JSON.stringify(rowData.value));
        const alr: AlertExtendedConfig = {
            acceptText: null,
            cancelText: null,
            icon: 'info',
            isHTML: true,
            showConfirmButton: true,
        };
        Alert.success(
            '',
            ` <li> Mision inst: ${metaCapturada.componenteMi ?? '--'} </li>
        <li> Pilar Estrategico: ${metaCapturada.pilarEstrategicoMi ?? '--'} </li>
        <li> Indicador: ${metaCapturada.indicadorMi ?? '--'} </li>
        <li> Sub indicador:  ${metaCapturada.subIndicadorMi ?? '--'} </li>`,
            alr
        );
    }

    obtenerListaElementos() {
        this.metasAreaResponsableApi
            .getMetasAreaResponsableById(
                this.dataRow.cfgGeneralId,
                this.dataRow.metasAreaResponsableId,
                this.dataRow.areaResponsableId,
                this.dataRow.idproceso
            )
            .subscribe((response: ResponseV1<any>) => {
                this.metasIndicadoresCapturaDTO = response.output;
                if (response) {
                    this.metasIndicadoresCapturaDTO = response.output;
                    if (response.output) {
                        response.output.forEach((item) => {
                            item.configGeneralId = this.metasIndicadores.id;
                            item.indicadorSiacId = item.indicadorKpiid;

                            if (!item.resultadoAnterior) {
                                item.resultadoAnterior = 0;
                            }

                            item.Activo = true;
                            item.FechaCreacion = new Date();
                            item.FechaModificacion = new Date();
                            item.usuarioCreacion = 0;
                        });
                    }

                    let arrFormGroup = this.metasIndicadoresCapturaDTO.map(MetasIndicadoresCapturaDTO.asFormGroup);
                    this.form.setControl('elementos', new FormArray(arrFormGroup));
                }
            });
    }

    onUpdateConfiguration() {
        var usrModificacion = Auth.getSession().id;
        this.metasIndicadores.filter = { Id: 0, ConfigGeneralId: 0 };
        const arrCaptura = JSON.parse(JSON.stringify(this.form.value)); // transformo el form en elementos
        this.metasIndicadores.metasIndicador = arrCaptura.elementos; // asigno elementos actualizados al row proporcionado de la lista
        // Elimina justificaciones que no tengan el check
        this.metasIndicadores.metasIndicador.forEach((item: any) => {
            if (!item.noAplica) {
                item.justificacionNa = '';
            }
            item.usuarioModificacion = usrModificacion;
        });
        //
        this.metasAreaResponsableApi
            .addMetasAreaResponsable(this.metasIndicadores.metasIndicador)
            .subscribe((response: ResponseV1<any>) => {
                if (response.exito) {
                    Alert.success('', 'Registro guardado correctamente');
                    this.dialogRef.close(response);
                }
            });
    }

    onClose() {
        this.dialogRef.close();
    }

    getNormativaList(row: any) {
        let html = '<ul>';
        if (row) {
            row.forEach((item: any) => {
                if (item.nombre != null) html += `<li>${item.clave} - ${item.nombre}</li>`;
                else html = '<li>Sin selección</li>';
            });
            html += '</ul>';
        } else html = '';
        // console.log();
        return html;
    }

    getRegionListHeader() {
        var region = Auth.getSession().regiones;
        let litaStr = '';

        if (region) {
            region.forEach((item, index: number) => {
                litaStr += `${item.clave}  ${index > 1 ? '-' : ''} `;
            });
        }
        return litaStr;
    }

    getCampusListHeader() {
        var region = Auth.getSession().campuses;
        let litaStr = '';

        if (region) {
            region.forEach((item, index: number) => {
                litaStr += `${item.clave}  ${index > 1 ? '-' : ''} `;
            });
        }
        return litaStr;
    }
}
