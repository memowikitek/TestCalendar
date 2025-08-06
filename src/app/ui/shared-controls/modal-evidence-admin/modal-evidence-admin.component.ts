import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { ResponseV1 } from 'src/app/utils/interfaces';
import { Alert, AlertConfig, AlertExtendedConfig, Auth } from 'src/app/utils/helpers';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormArray, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EvidenciasIndicadorService } from 'src/app/core/services';
import { EvidenciasIndicadorCapturaDTO } from 'src/app/utils/models/evidencias-indicador-captura-dto';
import { ConfiguracionGeneral } from 'src/app/utils/models/configuracion-general';
import {
    AreaResponsableDTOV1,
    EvidenceDTO,
    NivelModalidadDTOV1,
    Perfil,
    PeriodoEvaluacionDTOV1,
} from 'src/app/utils/models';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { EvidenciasArchivo } from 'src/app/utils/models/evidencias-archivo';
import { MatTableDataSource } from '@angular/material/table';
import { saveAs } from 'file-saver';
import { EvidenciasAreaResponsableAdd } from 'src/app/utils/models/evidencias-area-responsable-add';
import { EvidenciasArchivosAdd } from 'src/app/utils/models/evidencias-archivos-add';
import { EvidenciasIndicadoresAdd } from 'src/app/utils/models/evidencias-indicadores-add';
import { SubModalFileEvidenceConfigComponent } from './sub-modal-file-evidence-config/sub-modal-file-evidence-config.component';
import { IndicadorEvidencia } from 'src/app/utils/models/indicador-evidencia';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-modal-evidence-admin',
    templateUrl: './modal-evidence-admin.component.html',
    styleUrls: ['./modal-evidence-admin.component.scss'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({ height: '0px', minHeight: '0' })),
            state('expanded', style({ height: '*' })),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
})
export class ModalEvidenceAdminComponent implements OnInit {
    listEvidenciasIndicadorCaptura: EvidenciasIndicadorCapturaDTO[] = [];
    dataRow: any;
    configGeneralInfo: ConfiguracionGeneral;
    expandedElement: EvidenciasIndicadorCapturaDTO | null;
    panelOpenState = true;
    columnsToDisplay = ['nombre'];
    innerDisplayedColumns = ['nombre'];
    titleViewBotton = 'Ver';
    visualizaCambioEstado = false;
    admin = false;
    puedeCapturar = false;

    displayedColumns: string[] = ['estatus', 'nombre', 'justificacion', 'actualizarestatus', 'acciones'];

    constructor(
        @Inject(MAT_DIALOG_DATA) public evidenciasIndiokcador: any,
        private ref: ChangeDetectorRef,
        public dialogRef: MatDialogRef<ModalEvidenceAdminComponent>,
        private apiEvidenciasIndicadorService: EvidenciasIndicadorService,
        public dialog: MatDialog
    ) {
        this.puedeCapturar = evidenciasIndiokcador.data.puedeCapturar;
        this.dataRow = evidenciasIndiokcador.data;
        this.expandedElement = new EvidenciasIndicadorCapturaDTO();
        this.expandedElement.evidenciasArchivos = [];

        this.configGeneralInfo = new ConfiguracionGeneral();
        this.configGeneralInfo.periodoEvaluacion = new PeriodoEvaluacionDTOV1();
        this.configGeneralInfo.periodoEvaluacionId = this.dataRow.periodoEvaluacionId;
        this.configGeneralInfo.periodoEvaluacion = this.dataRow.periodoEvaluacion;
        this.configGeneralInfo.areaResponsable = new AreaResponsableDTOV1();
        this.configGeneralInfo.areaResponsable = this.dataRow.areaResponsable;

        this.configGeneralInfo.nivelModalidad = new NivelModalidadDTOV1();
        this.configGeneralInfo.nivelModalidad = this.dataRow.niveles;
        this.configGeneralInfo.nivelesModalidad = this.dataRow.niveles;

        let perfil = new Perfil();
        perfil = Auth.getSession();
        this.visualizaCambioEstado = perfil.esAutorizador;
        this.admin = perfil.esAdmin;
        
        if (!this.visualizaCambioEstado && !this.admin) {
            this.displayedColumns = ['estatus', 'nombre', 'justificacion', 'acciones'];
        }

        if (!this.puedeCapturar) {
            if (evidenciasIndiokcador.data.fechaActual < evidenciasIndiokcador.data.fechaInicio)
                Alert.warn('', `Aun no inicia la etapa de captura de evidencias y solo se pueden consultar`);
            else Alert.warn('', `La etapa de captura de evidencias ya concluyó y solo se pueden consultar`);
        }
    }

    ngOnInit(): void {
        this.apiEvidenciasIndicadorService
            .getEvidenciasIndicadorId(this.dataRow.configGeneral.id, this.dataRow.id)
            .subscribe((res) => {
                this.listEvidenciasIndicadorCaptura = res.output;
            });
    }

    toggleRow(event: any, element: EvidenciasIndicadorCapturaDTO) {
        if (
            (event.srcElement && (event.srcElement.innerText === 'Ver' || event.srcElement.innerText === 'Ocultar')) ||
            event.srcElement.id === 'ver' ||
            event.srcElement.id === 'Ocultar' ||
            event.srcElement.innerText.includes('Ver')
        ) {
            element.evidenciasArchivos?.length
                ? (this.expandedElement = this.expandedElement === element ? null : element)
                : null;
            this.ref.detectChanges();
            // event.srcElement.innerText = this.expandedElement ? 'Ocultar' : 'Ver'
        }
    }

    onChangeEvidenceFile(row: any) {
        let consecutivoArchivo = row.evidenciasArchivos.length + 1;
        let claveCampusTxt = '';
        // Clave campus
        if (this.dataRow.claveCampus) {
            claveCampusTxt = '_' + this.dataRow.claveCampus;
        }

        // let valueName = `${this.dataRow.anio}_${this.dataRow.ciclo.substring(this.dataRow.ciclo.length - 1)}_${
        //     this.dataRow.periodoEvaluacionId
        let valueName = `${this.dataRow.anio}_C${this.dataRow.ciclo.substring(this.dataRow.ciclo.length - 1)}_${
            this.dataRow.claveInstitucion
        }${claveCampusTxt}_${
            this.dataRow.claveAreaResponsable
        }_${row.componenteClave.trim()}${row.indicadorKpiclave.trim()}_${
            row.nivelModalidadId == 0 ? 'G' : row.claveNivelModalidad
        }_O_${consecutivoArchivo}`;

        const dialogRef = this.dialog.open(SubModalFileEvidenceConfigComponent, {
            width: '50vh',
            maxHeight: '90vh',
            data: { nomFilename: valueName, row: row },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                let newFile = new EvidenciasArchivo();
                newFile.archivoId = 0;
                newFile.tipoEvidencia = result.tipoevidencia;
                newFile.justificacion = result.justificacion;
                newFile.url = result.url;
                newFile.archivoBase64String = result.archivoBase64String;
                newFile.nombre = result.nombrearchivo;

                row.evidenciasArchivos.push(newFile);
                this.expandedElement = null;
                this.ref.detectChanges();
            }
        });
    }

    onDownloadFormat(row: EvidenciasIndicadorCapturaDTO) {
        this.apiEvidenciasIndicadorService.getFormatoById(row.archivoAzureId).subscribe((res) => {
            saveAs(res, row.nombreArchivo);
        });
    }

    onClose() {
        this.dialogRef.close(false);
    }

    onAdd() {
        let archivosInsertados = this.listEvidenciasIndicadorCaptura.filter((evi) =>
            evi.evidenciasArchivos.find((ar) => ar.archivoId == 0)
        ); // select only newfiles
        if (archivosInsertados.length > 0) {
            let evidenciasAreaResponsableAdd = new EvidenciasAreaResponsableAdd();
            evidenciasAreaResponsableAdd.id = this.dataRow.id; // es un nuevo area responsable con evidencia eso viene del row
            evidenciasAreaResponsableAdd.configGeneralId = this.dataRow.configGeneral.id;
            evidenciasAreaResponsableAdd.areaResponsableId = this.dataRow.areaResponsable.id;
            evidenciasAreaResponsableAdd.nivelModalidadId = this.dataRow.nivelModalidadId;
            evidenciasAreaResponsableAdd.porcentajeMaximo = null; // agregado despues del primer intento
            evidenciasAreaResponsableAdd.totalEvidencias = 2; // preguntar si puedo mandarlo en nulo
            evidenciasAreaResponsableAdd.evidenciasObligatorias = 0; // preguntar si puedo mandarlo en nulo
            evidenciasAreaResponsableAdd.calculoAvance = 0; // preguntar si puedo mandarlo en nulo
            evidenciasAreaResponsableAdd.activo = true; // preguntar si puedo mandarlo en nulo
            evidenciasAreaResponsableAdd.usuarioCreacion = 1; // preguntar si puedo mandarlo en nulo
            evidenciasAreaResponsableAdd.evideIndicadores = [];

            archivosInsertados.forEach((itemEvidenciasIndicadorCaptura) => {
                let evidenciasIndicadoresAdd = new EvidenciasIndicadoresAdd();
                evidenciasIndicadoresAdd.evidenciasId = itemEvidenciasIndicadorCaptura.evidenciasId;
                evidenciasIndicadoresAdd.indicadorSiacId = itemEvidenciasIndicadorCaptura.indicadorKpiid; // recordar que la siac es el kpi
                evidenciasIndicadoresAdd.evidenciaId = itemEvidenciasIndicadorCaptura.evidenciaId;
                evidenciasIndicadoresAdd.tipoEvidencia = itemEvidenciasIndicadorCaptura.tipoEvidencia;
                // evidenciasIndicadoresAdd.justificacion = itemEvidenciasIndicadorCaptura.justificacion;
                // evidenciasIndicadoresAdd.estatus = itemEvidenciasIndicadorCaptura.estatus;
                // evidenciasIndicadoresAdd.url = itemEvidenciasIndicadorCaptura.url;
                evidenciasIndicadoresAdd.activo = itemEvidenciasIndicadorCaptura.activo;
                evidenciasIndicadoresAdd.usuarioCreacion = 1;
                evidenciasIndicadoresAdd.nivelModalidadId = itemEvidenciasIndicadorCaptura.nivelModalidadId;

                evidenciasIndicadoresAdd.evidenciasArchivosAdds = [];
                // se agregan los archivos
                itemEvidenciasIndicadorCaptura.evidenciasArchivos
                    .filter((f) => f.archivoId === 0)
                    .forEach((itemEvidenciasArchivos) => {
                        let evidenciasArchivosAdd = new EvidenciasArchivosAdd();
                        evidenciasArchivosAdd.evidenciaId = itemEvidenciasIndicadorCaptura.evidenciaId;
                        evidenciasArchivosAdd.indicadorSiacId = itemEvidenciasIndicadorCaptura.indicadorKpiid; // recordar que la siac es el kpi
                        evidenciasArchivosAdd.evidenciasId = itemEvidenciasIndicadorCaptura.evidenciasId;

                        //Del archivo
                        evidenciasArchivosAdd.archivoId = itemEvidenciasArchivos.archivoId;
                        evidenciasArchivosAdd.nombre = itemEvidenciasArchivos.nombre;
                        evidenciasArchivosAdd.File = itemEvidenciasArchivos.archivoBase64String;

                        evidenciasArchivosAdd.url = itemEvidenciasArchivos.url;
                        evidenciasArchivosAdd.tipoEvidencia = itemEvidenciasArchivos.tipoEvidencia;
                        evidenciasArchivosAdd.justificacion = itemEvidenciasArchivos.justificacion;

                        evidenciasArchivosAdd.activo = true; // preguntar ver si se puede omitir
                        evidenciasArchivosAdd.usuarioCreacion = 1; //preguntar  ver si se puede omitir
                        evidenciasArchivosAdd.nivelModalidadId = itemEvidenciasIndicadorCaptura.nivelModalidadId;

                        //Agrega el archivo
                        evidenciasIndicadoresAdd.evidenciasArchivosAdds.push(evidenciasArchivosAdd);
                    });

                // se agrega la evidencia indicador
                evidenciasAreaResponsableAdd.evideIndicadores.push(evidenciasIndicadoresAdd);
            });

            this.apiEvidenciasIndicadorService.createAdd(evidenciasAreaResponsableAdd).subscribe((res) => {
                if (res && res.exito) {
                    Alert.success('', 'Las evidencias se crearon correctamente.');
                    this.dialogRef.close(true);
                }
            });
        } else {
            this.dialogRef.close(true);
        }
    }

    OnDownloadEvidence(element: any) {
        this.apiEvidenciasIndicadorService.downloadFile(element.archivoId).subscribe((res) => {
            saveAs(res, element.nombre);
        });
    }

    OnDeleteEvidence(row: any, element: EvidenciasIndicadorCapturaDTO) {
        if (row.archivoId == 0) {
            // no se a guardado en el azure
            let index = element.evidenciasArchivos.findIndex(
                (ev) => ev.archivoId == row.archivoId && ev.nombre == row.nombre
            );
            element.evidenciasArchivos.splice(index, 1);
            this.expandedElement = null;
            this.ref.detectChanges();
            Alert.success('', 'Evidencia eliminada correctamente');
            this.expandedElement = element;
            this.ref.detectChanges();
            return;
        }
        Alert.confirm('Eliminar archivo de evidencia', `¿Deseas eliminar el archivo de evidencia?`).subscribe(
            (result) => {
                if (!result || !result.isConfirmed) {
                    return;
                }
                // Elimina
                this.apiEvidenciasIndicadorService
                    .deleteFile(row.evidenciasId, row.indicadorSiacId, row.archivoId)
                    .subscribe((res) => {
                        let index = element.evidenciasArchivos.findIndex(
                            (ev) => ev.archivoId == row.archivoId && ev.nombre == row.nombre
                        );
                        element.evidenciasArchivos.splice(index, 1);
                        this.expandedElement = null;
                        this.ref.detectChanges();
                        Alert.success('', 'Evidencia eliminada correctamente');
                        this.expandedElement = element;
                        this.ref.detectChanges();
                    });
                //
            }
        );
    }
    getEstatusIndicador(row: any) {
        var cantidadO = 0;
        row.evidenciasArchivos.forEach(function (item: any) {
            if (item.tipoEvidencia == 'O') {
                cantidadO += 1;
            }
        });
        if (cantidadO >= row.cantidad) {
            return 1; // verde
        }

        if (!row.evidenciasArchivos) {
            return 2; // rojo
        }

        return 2;
    }

    getEstatusFile(row: any) {
        return 1;
    }

    OnOpenBrowser(row: any) {
        window.open(row.url, '_blank');
    }

    getEstatusText(row: any) {
        switch (row.estatus) {
            case 0: {
                return 'No entregada';
            }
            case 1: {
                return 'Entregada';
                //statements;
            }
            case 2: {
                return 'Aceptada';
                //statements;
            }
            case 3: {
                return 'No aceptada';
                //statements;
            }
            default: {
                return 'Sin estatus';
            }
        }
    }
    getTitleIndicador(row: any) {
        return row.indicadorKpiclave + ' - ' + row.indicadorKpinombre;
    }
    getActualizaEstado(row: any, element: EvidenciasIndicadorCapturaDTO, estado: number) {
        this.apiEvidenciasIndicadorService
            .updateEvidenceFileState(row.archivoId, estado, element.evidenciasId, this.dataRow.configGeneral.id)
            .subscribe((res) => {
                if (res.exito) {
                    let index = element.evidenciasArchivos.findIndex(
                        (ev) => ev.archivoId == row.archivoId && ev.nombre == row.nombre
                    );
                    element.evidenciasArchivos[index].estatus = estado;

                    this.expandedElement = null;
                    this.ref.detectChanges();
                    Alert.success('', 'Evidencia actualizada correctamente');
                    this.expandedElement = element;
                    this.ref.detectChanges();
                }
            });
    }

    // evidenciasIndicador: IndicadorEvidencia[]
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

    getNormativaList(normativas: any) {
        let html = '<ul>';
        if (normativas) {
            normativas.forEach((item: any) => {
                html += `<li>${item.clave} - ${item.nombre}</li>`;
            });
            html += '</ul>';
        } else html = '';
        return html;
    }
}
