import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { FileResponse, Response, ResponseV1 } from 'src/app/utils/interfaces';
import { IndicadorDTO, PageResult, PageResultV1, TablePaginatorSearch } from 'src/app/utils/models';
import { EvidenciasArchivo } from 'src/app/utils/models/evidencias-archivo';
import { EvidenciasIndicadorCapturaDTO } from 'src/app/utils/models/evidencias-indicador-captura-dto';
import { environment } from 'src/environments/environment';
import { EvidenciasIndicadorDTO } from 'src/app/core/models/evidencias-indicador-dto';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { EvidenciasAreaResponsableAdd } from 'src/app/utils/models/evidencias-area-responsable-add';
@Injectable({
    providedIn: 'root',
})
export class EvidenciasIndicadorService {
    constructor(private http: HttpClient) {}

    getEvidenciasIndicadorId(
        configGeneralId: number,
        id: number
    ): Observable<ResponseV1<EvidenciasIndicadorCapturaDTO>> {
        if (id) {
            return this.http.get<ResponseV1<EvidenciasIndicadorCapturaDTO>>(
                environment.api.concat(`/EvidenciasIndicador/GetById?id=${id}&ConfigGeneralId=${configGeneralId}`)
            );
        } else {
            return this.http.get<ResponseV1<EvidenciasIndicadorCapturaDTO>>(
                environment.api.concat(`/EvidenciasIndicador/GetById?ConfigGeneralId=${configGeneralId}`)
            );
        }
    }
    getAllndicatorsMetasExcel(filters: TablePaginatorSearch) {
        return this.http.get(environment.api.concat('/EvidenciasIndicador/ExcelMetasDescarga'), {
            params: {
                filtro: JSON.stringify(filters.filter),
            },
            responseType: 'blob',
        });
    }
    createAdd(body: EvidenciasAreaResponsableAdd): Observable<ResponseV1<any>> {
        return this.http.post<ResponseV1<never>>(environment.api.concat('/EvidenciasIndicador/Add'), body,{ headers: new HttpHeaders({ timeout: `${600000}` }) });
    }

    updateEvidenceFileState(archivoId: number, estado: number,evidenciasId:number, configGeneralId : number): Observable<ResponseV1<number>> {
        return this.http.put<ResponseV1<number>>(
            environment.api.concat(`/EvidenciasIndicador/UpdateEvidenceFileState/${archivoId}/${estado}/${evidenciasId}/${configGeneralId}`),
            {}
        );
    }

    getFormatoById(archivoAzureId: number) {
        return this.http.get(environment.api.concat(`/AzureStorage/Download/${archivoAzureId}/evidencias`), {
            responseType: 'blob',
        });
    }

    downloadFile(archivoAzureId: number) {
        return this.http.get(environment.api.concat(`/AzureStorage/Download/${archivoAzureId}/evidencias`), {
            responseType: 'blob',
        });
    }

    deleteFile(evidenciasId: number, indicadorSiacId: number, archivoId: number): Observable<ResponseV1<never>> {
        return this.http.delete<never>(
            environment.api.concat(
                `/EvidenciasIndicador/Delete?EvidenciasId=${evidenciasId}&IndicadorSiacId=${indicadorSiacId}&ArchivoId=${archivoId}`
            )
        );
    }

    getAllEvideciasIndicador(
        filters: TablePaginatorSearch
    ): Observable<ResponseV1<PageResultV1<EvidenciasIndicadorDTO[]>>> {
        return this.http.get<ResponseV1<PageResultV1<EvidenciasIndicadorDTO[]>>>(
            environment.api.concat('/EvidenciasIndicador/GetAll'),
            {
                params: {
                    filtro: JSON.stringify(filters.filter),
                    pageSize: filters.pageSize,
                    pageNumber: filters.pageNumber,
                },
            }
        );
    }

    onCreateDummyTable(): EvidenciasIndicadorCapturaDTO[] {
        let tempList: EvidenciasIndicadorCapturaDTO[];

        // items
        let temp1 = new EvidenciasIndicadorCapturaDTO();

        temp1.id = 16;
        temp1.evidenciasId = 3;
        temp1.cantidad = 1;
        temp1.nombre = 'Nombre evidencia 1';
        temp1.archivoAzureId = null; // es el archivo de formato si no tiene arvhivo de formato viene en null

        let newFile = new EvidenciasArchivo();
        newFile.archivoId = 23;
        newFile.nombre = 'Reporte.doc';

        let newFile1 = new EvidenciasArchivo();
        newFile1.archivoId = 30;
        newFile1.nombre = 'Reporte.xls';

        temp1.evidenciasArchivos.push(newFile);
        temp1.evidenciasArchivos.push(newFile1);

        temp1.componenteid = 1;
        temp1.componenteNombre = 'Estudiantes';
        temp1.componenteClave = 'A.1';

        //elemento 1
        temp1.elementoEvaluacionId = 193;
        temp1.elementoEvaluacionClave = 'A1';
        temp1.elementoEvaluacionNombre = 'Captación de aspirantes';

        // cada elemento tiene un indicador
        temp1.indicadorKpiid = 8;
        temp1.indicadorKpiclave = 'A1.1';
        temp1.indicadorKpinombre = '';
        temp1.indicadorKPIDescripcion =
            'Proporción de estudiantes inscritos en relación con la meta total (resultados de vinculación, fuente promoción)';

        // cada elemento tiene una normativa
        temp1.normativaId = 1;
        temp1.normativaClave = 'RI - 1';
        temp1.normativaNombre =
            'LINEAMIENTOS DEL COMITÉ DE INGRESO Y PERMANENCIA ESTUDIANTIL (CIPE) DE LA UNIVERSIDAD DEL VALLE DE MÉXICO';

        temp1.misioninstitucional = 'Pilar estrategico para la Matiz';
        temp1.pilarestrategico = 'Pilar estrategico para la Matiz';
        temp1.indicadorMi = 'Pilar estrategico para la Matiz';
        temp1.subindicadorMi = 'Pilar estrategico para la Matiz';

        temp1.autorizadoNa = false;

        ////////////////////////////////////////////////////////////////////////////////////////77

        // items
        let temp2 = new EvidenciasIndicadorCapturaDTO();

        temp2.id = 16;
        temp2.evidenciasId = 3;
        temp2.cantidad = 1;
        temp2.nombre = 'Evidencias de captura';
        temp2.archivoAzureId = 103; // es el archivo de formato si no tiene arvhivo de formato viene en null

        let newFile2 = new EvidenciasArchivo();
        newFile2.archivoId = 23;
        newFile2.nombre = 'Reporte.doc';

        let newFile3 = new EvidenciasArchivo();
        newFile3.archivoId = 30;
        newFile3.nombre = 'Reporte.xls';

        let newFile4 = new EvidenciasArchivo();
        newFile3.archivoId = 30;
        newFile3.nombre = 'lista_examenes.xls';

        let newFile5 = new EvidenciasArchivo();
        newFile3.archivoId = 30;
        newFile3.nombre = 'Evidenciadedocumentos.doc';

        let newFile6 = new EvidenciasArchivo();
        newFile6.archivoId = 30;
        newFile6.nombre = 'Base de conocimiento.doc';

        temp2.evidenciasArchivos.push(newFile2);
        temp2.evidenciasArchivos.push(newFile3);
        temp2.evidenciasArchivos.push(newFile6);

        temp2.componenteid = 1;
        temp2.componenteNombre = 'Estudiantes';
        temp2.componenteClave = 'A.1';

        //elemento 1
        temp2.elementoEvaluacionId = 193;
        temp2.elementoEvaluacionClave = 'A1';
        temp2.elementoEvaluacionNombre = 'Captación de aspirantes';

        // cada elemento tiene un indicador
        temp2.indicadorKpiid = 8;
        temp2.indicadorKpiclave = 'A1.1';
        temp2.indicadorKpinombre = '';
        temp2.indicadorKPIDescripcion =
            'Proporción de estudiantes inscritos en relación con la meta total (resultados de vinculación, fuente promoción)';

        // cada elemento tiene una normativa
        temp2.normativaId = 1;
        temp2.normativaClave = 'RI - 1';
        temp2.normativaNombre =
            'LINEAMIENTOS DEL COMITÉ DE INGRESO Y PERMANENCIA ESTUDIANTIL (CIPE) DE LA UNIVERSIDAD DEL VALLE DE MÉXICO';

        temp2.misioninstitucional = 'Pilar estrategico para la Matiz';
        temp2.pilarestrategico = 'Pilar estrategico para la Matiz';
        temp2.indicadorMi = 'Pilar estrategico para la Matiz';
        temp2.subindicadorMi = 'Pilar estrategico para la Matiz';

        temp2.autorizadoNa = false;

        tempList = [];
        tempList.push(temp1);
        tempList.push(temp2);
        // tempList.push(temp5);
        // tempList.push(temp3);
        //
        return tempList;
    }
}
