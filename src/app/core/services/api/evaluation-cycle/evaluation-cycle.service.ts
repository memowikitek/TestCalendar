import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { filter, Observable, of, throwError } from 'rxjs';
import { FileResponse, ResponseV1 } from 'src/app/utils/interfaces';
import { CicloCeEvaluacionAll } from 'src/app/utils/models/ciclo-evaluacion-indicadores.dto';
import { CicloEvaDTOV1, CycleEvaDTOV1, GetLastCEDTOV1, PageResultV1, TablePaginatorSearch } from 'src/app/utils/models';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { NotificacionesNaDto } from 'src/app/utils/models/notificaciones-na.dto';

export interface CicloEva { data: CicloEvaDTOV1; }
@Injectable({ providedIn: 'root' })

export class EvaluationCycleService {

    constructor(private http: HttpClient, private dialog: MatDialog) { }

    getAllEvaluacionCycle(filters: TablePaginatorSearch): Observable<ResponseV1<PageResultV1<CicloEvaDTOV1[]>>> {
        return this.http.get<ResponseV1<PageResultV1<CicloEvaDTOV1[]>>>(environment.api.concat('/CfgCicloEvaluacion/GetAll'), {
            params: {
                filtro: JSON.stringify(filters.filter),
                pageNumber: filters.pageNumber,
                pageSize: filters.pageSize
            },
        });
    }

    getAllEvaluacionCycleFilter(filters: TablePaginatorSearch): Observable<ResponseV1<PageResultV1<CicloEvaDTOV1[]>>> {
        return this.http.get<ResponseV1<PageResultV1<CicloEvaDTOV1[]>>>(environment.api.concat('/CfgCicloEvaluacion/GetAllFilter'), {
            params: {
                filtro: JSON.stringify(filters.filter),
                pageNumber: filters.pageNumber,
                pageSize: filters.pageSize
            },
        });
    }

    getCEEvaluacion(filters: TablePaginatorSearch,fecha: string): Observable<ResponseV1<PageResultV1<CicloEvaDTOV1[]>>> {
        return this.http.get<ResponseV1<PageResultV1<CicloEvaDTOV1[]>>>(environment.api.concat('/CfgCicloEvaluacion/GetAll?fecha='+fecha), {
            params: {
                filtro: JSON.stringify(filters.filter),
                pageNumber: filters.pageNumber,
                pageSize: filters.pageSize
            },
        });
    }

    getCEEvaluacionCatalogo(filters: TablePaginatorSearch,fecha: string): Observable<ResponseV1<PageResultV1<CicloEvaDTOV1[]>>> {
        return this.http.get<ResponseV1<PageResultV1<CicloEvaDTOV1[]>>>(environment.api.concat('/CfgCicloEvaluacion/CatalogosGetAll?fecha='+fecha), {
            params: {
                filtro: JSON.stringify(filters.filter)
            },
        });
    }

    getCategory(): Observable<any> {
        return this.http.get<any>(environment.api.concat(`/CfgCicloEvaluacion/GetCatalog`));
    }
    
    createEvaluacionCycle(body: CycleEvaDTOV1): Observable<ResponseV1<never>> {
        return this.http.post<ResponseV1<never>>(environment.api.concat('/CfgCicloEvaluacion/Add'), body);
    }

    //Nuevo Crear Ciclo
    createEvaluacionCycleAll(body: CycleEvaDTOV1): Observable<ResponseV1<never>> {
        return this.http.post<ResponseV1<never>>(environment.api.concat('/CfgCicloEvaluacion/AddCiclo'), body);
    }

    //Consultar Ciclo Anterior
    getLastCE(filters: TablePaginatorSearch): Observable<ResponseV1<PageResultV1<GetLastCEDTOV1[]>>> {
        return this.http.get<ResponseV1<PageResultV1<GetLastCEDTOV1[]>>>(environment.api.concat('/CfgCicloEvaluacion/GetLastCicleAll'), {
            params: {
                filtro: JSON.stringify(filters.filter)
            },
        });
    }

    //Meta Institucional
    updateMetaInstitucional(Id: number, meta: any): Observable<ResponseV1<never>> {
        return this.http.put<ResponseV1<never>>(environment.api.concat(`/CfgCicloEvaluacion/UpdateCeIndicadorMeta?CeevaluacionId=${Id}&MetaInstitucional=${meta}`),{});
    }

    addUpdateCeEtapa1Meta(body: any, usuarioId:number): Observable<ResponseV1<never>> {
        return this.http.post<ResponseV1<never>>(environment.api.concat(`/CfgCicloEvaluacion/AddUpdateCeEtapa1Meta?usuarioId=${usuarioId}`), body);
    }

    addUpdateCeEtapa2Meta(body: any): Observable<ResponseV1<never>> {
        return this.http.post<ResponseV1<never>>(environment.api.concat(`/CfgCicloEvaluacion/AddUpdateCeEtapa2Evidencia`), body);
    }

    sendNotificacionNA(mensaje: NotificacionesNaDto): Observable<ResponseV1<never>> {
        
        return this.http.post<ResponseV1<never>>(environment.api.concat(`/Notificaciones/SendNotificacionNA`), mensaje);
    }

    addUpdateCeEtapa3Resultado(body: any,usuarioId:number): Observable<ResponseV1<never>> {
        return this.http.post<ResponseV1<never>>(environment.api.concat(`/CfgCicloEvaluacion/AddUpdateCeEtapa3Resultado?usuarioId=${usuarioId}`), body);
    }

    addUpdateCeEtapa5RevisionAutoevaluacionDepAreaSesion(body: any,usuarioId:number): Observable<ResponseV1<never>> {
        return this.http.post<ResponseV1<never>>(environment.api.concat(`/CfgCicloEvaluacion/AddUpdateCeEtapa5RevisionAutoevaluacionDepAreaSesion?usuarioId=${usuarioId}`), body);
    }

    addDeleteCeEtapa6PlanMejoraArchivo(body: any): Observable<ResponseV1<never>> {
        return this.http.post<ResponseV1<never>>(environment.api.concat(`/CfgCicloEvaluacion/AddDeleteCeEtapa6PlanMejoraArchivo`), body);
    }
    

    updateCEEtapa6PlanMejoraArchivoAutorizacion(body: any): Observable<ResponseV1<never>> {
        return this.http.put<ResponseV1<never>>(environment.api.concat(`/CfgCicloEvaluacion/UpdateCEEtapa6PlanMejoraArchivoAutorizacion`), body);
    }

    
    updateCEEtapa6PlanMejoraDecision(body: any): Observable<ResponseV1<never>> {
        return this.http.put<ResponseV1<never>>(environment.api.concat(`/CfgCicloEvaluacion/UpdateCEEtapa6PlanMejoraDecision`), body);
    }

    addCeEtapa6PlanMejoraEvidencia(body: any): Observable<ResponseV1<never>> {
        return this.http.post<ResponseV1<never>>(environment.api.concat(`/CfgCicloEvaluacion/AddCeEtapa6PlanMejoraEvidencia`), body);
    }

    getAzureFilePM(archivoAzureId: number){
        return this.http.get(environment.api.concat(`/AzureStorage/Download/${archivoAzureId}/ceplanmejoraevidencias`), {
            responseType: 'blob',
        });
    }

    
    addUpdateCeEtapa4Autoevaluacion(body: any,usuarioId:number): Observable<ResponseV1<never>> {
        return this.http.post<ResponseV1<never>>(environment.api.concat(`/CfgCicloEvaluacion/AddUpdateCeEtapa4Autoevaluacion?usuarioId=${usuarioId}`), body);
    }

    addUpdateCeEtapa5RevisionAutoevaluacion(body: any,usuarioId:number): Observable<ResponseV1<never>> {
        return this.http.post<ResponseV1<never>>(environment.api.concat(`/CfgCicloEvaluacion/AddUpdateCeEtapa5RevisionAutoevaluacion?usuarioId=${usuarioId}`), body);
    }

    updateEvaluacionCycle(body: CycleEvaDTOV1): Observable<ResponseV1<never>> {
        return this.http.put<ResponseV1<never>>(environment.api.concat('/CfgCicloEvaluacion/Update'), body);
    }

    deleteEvaluacionCycle(Id: number): Observable<ResponseV1<never>> {
        return this.http.delete<never>(environment.api.concat(`/CfgCicloEvaluacion/Delete/?cicloEvaluacionId=${Id}`));
    }

    deleteCeEtapa6PMEEvidenciaArchivo(Id: number): Observable<ResponseV1<never>> {
        return this.http.delete<never>(environment.api.concat(`/CfgCicloEvaluacion/DeleteCeEtapa6PMEEvidenciaArchivo?Id=${Id}`));
    }

    deleteIndicadoresCycle(Id: number): Observable<ResponseV1<never>> {
        return this.http.delete<never>(environment.api.concat(`/CfgCicloEvaluacion/DeleteIndicadoresProcesEvaAll/?cicloEvaluacionId=${Id}`));
    }

    getEvaluacionCycleById(Id: number): Observable<ResponseV1<CicloEvaDTOV1>> {
        return this.http.get<ResponseV1<CicloEvaDTOV1>>(environment.api.concat(`/CfgCicloEvaluacion/GetById?CicloEvaluacionId=${Id}`));
    }



    getIndicatorsByCycleId(filters: TablePaginatorSearch, Id: number, UserId: number): Observable<ResponseV1<PageResultV1<CicloEvaDTOV1[]>>> {
        return this.http.get<ResponseV1<PageResultV1<CicloEvaDTOV1[]>>>(environment.api.concat('/CfgCicloEvaluacion/GetIndicadoresProcesEvaAll'), {
            params: {
                filtro: JSON.stringify(filters.filter),
                pageNumber: filters.pageNumber,
                pageSize: filters.pageSize,
                cicloEvaluacionId: Id,
                userId: UserId,

            },
        });
    }

    getCeEvaluacionEtapa1All(filters: TablePaginatorSearch, Id: number): Observable<any> {
        return this.http.get<ResponseV1<PageResultV1<CicloEvaDTOV1[]>>>(environment.api.concat('/CfgCicloEvaluacion/GetCeIndicadoresEtapa1All'), {
            params: {
                filtro: JSON.stringify(filters.filter),
                pageNumber: filters.pageNumber,
                pageSize: filters.pageSize,
                cicloEvaluacionId: Id
            },
        });
    }

    getCEIndicadoresEtapa1(filters: TablePaginatorSearch): Observable<any> {
        return this.http.get<ResponseV1<PageResultV1<CicloEvaDTOV1[]>>>(environment.api.concat('/CfgCicloEvaluacion/GetCEIndicadoresEtapa1'), {
            params: {
                filtro: JSON.stringify(filters.filter),
                pageNumber: filters.pageNumber,
                pageSize: filters.pageSize
            },
        });
    }

    getCeEvaluacionEtapa2All(filters: TablePaginatorSearch, Id: number): Observable<any> {
        return this.http.get<ResponseV1<PageResultV1<CicloEvaDTOV1[]>>>(environment.api.concat('/CfgCicloEvaluacion/GetCeIndicadoresEtapa2All'), {
            params: {
                filtro: JSON.stringify(filters.filter),
                pageNumber: filters.pageNumber,
                pageSize: filters.pageSize,
                cicloEvaluacionId: Id
            },
        });
    }

    getCeIndicadoresEtapa2(filters: TablePaginatorSearch): Observable<any> {
        return this.http.get<ResponseV1<PageResultV1<CicloEvaDTOV1[]>>>(environment.api.concat('/CfgCicloEvaluacion/GetCeIndicadoresEtapa2'), {
            params: {
                filtro: JSON.stringify(filters.filter),
                pageNumber: filters.pageNumber,
                pageSize: filters.pageSize
            },
        });
    }

    getCeEvaluacionEtapa3All(filters: TablePaginatorSearch, Id: number): Observable<any> {
        return this.http.get<ResponseV1<PageResultV1<CicloEvaDTOV1[]>>>(environment.api.concat('/CfgCicloEvaluacion/GetCeIndicadoresEtapa3All'), {
            params: {
                filtro: JSON.stringify(filters.filter),
                pageNumber: filters.pageNumber,
                pageSize: filters.pageSize,
                cicloEvaluacionId: Id
            },
        });
    }

    getCeIndicadoresEtapa6PMDAll(filters: TablePaginatorSearch): Observable<any> {
        return this.http.get<ResponseV1<PageResultV1<CicloEvaDTOV1[]>>>(environment.api.concat('/CfgCicloEvaluacion/GetCeIndicadoresEtapa6PMDAll'), {
            params: {
                filtro: JSON.stringify(filters.filter),
                pageNumber: filters.pageNumber,
                pageSize: filters.pageSize
            },
        });
    }

    getCeIndicadoresEtapa6PMEAll(filters: TablePaginatorSearch): Observable<any> {
        return this.http.get<ResponseV1<PageResultV1<CicloEvaDTOV1[]>>>(environment.api.concat('/CfgCicloEvaluacion/GetCeIndicadoresEtapa6PMEAll'), {
            params: {
                filtro: JSON.stringify(filters.filter),
                pageNumber: filters.pageNumber,
                pageSize: filters.pageSize
            },
        });
    }

    getCeIndicadoresEtapa6PMDRI(filters: TablePaginatorSearch): Observable<any> {
        return this.http.get<ResponseV1<PageResultV1<CicloEvaDTOV1[]>>>(environment.api.concat('/CfgCicloEvaluacion/GetCeIndicadoresEtapa6PMDRI'), {
            params: {
                filtro: JSON.stringify(filters.filter),
                pageNumber: filters.pageNumber,
                pageSize: filters.pageSize
            },
        });
    }

    getCeIndicadoresEtapa3(filters: TablePaginatorSearch): Observable<any> {
        return this.http.get<ResponseV1<PageResultV1<CicloEvaDTOV1[]>>>(environment.api.concat('/CfgCicloEvaluacion/GetCeIndicadoresEtapa3'), {
            params: {
                filtro: JSON.stringify(filters.filter),
                pageNumber: filters.pageNumber,
                pageSize: filters.pageSize
            },
        });
    }

    getCeIndicadoresEtapa4(filters: TablePaginatorSearch): Observable<any> {
        return this.http.get<ResponseV1<PageResultV1<CicloEvaDTOV1[]>>>(environment.api.concat('/CfgCicloEvaluacion/GetCeIndicadoresEtapa4'), {
            params: {
                filtro: JSON.stringify(filters.filter),
                pageNumber: filters.pageNumber,
                pageSize: filters.pageSize
            },
        });
    }

    getCeEvaluacionEtapa4All(filters: TablePaginatorSearch, Id: number): Observable<any> {
        return this.http.get<ResponseV1<PageResultV1<CicloEvaDTOV1[]>>>(environment.api.concat('/CfgCicloEvaluacion/GetCeIndicadoresEtapa4All'), {
            params: {
                filtro: JSON.stringify(filters.filter),
                pageNumber: filters.pageNumber,
                pageSize: filters.pageSize,
                cicloEvaluacionId: Id
            },
        });
    }


    getCeIndicadoresEtapa5(filters: TablePaginatorSearch): Observable<any> {
        return this.http.get<ResponseV1<PageResultV1<CicloEvaDTOV1[]>>>(environment.api.concat('/CfgCicloEvaluacion/GetCeIndicadoresEtapa5'), {
            params: {
                filtro: JSON.stringify(filters.filter),
                pageNumber: filters.pageNumber,
                pageSize: filters.pageSize
            },
        });
    }

    getCeIndicadoresEtapa5DepAreaVw1(filters: TablePaginatorSearch): Observable<any> {
        return this.http.get<ResponseV1<PageResultV1<CicloEvaDTOV1[]>>>(environment.api.concat('/CfgCicloEvaluacion/GetCeIndicadoresEtapa5DepAreaVw1'), {
            params: {
                filtro: JSON.stringify(filters.filter),
                pageNumber: filters.pageNumber,
                pageSize: filters.pageSize
            },
        });
    }

    getCeIndicadoresEtapa5DepAreaVw2(filters: TablePaginatorSearch): Observable<any> {
        return this.http.get<ResponseV1<PageResultV1<CicloEvaDTOV1[]>>>(environment.api.concat('/CfgCicloEvaluacion/GetCeIndicadoresEtapa5DepAreaVw2'), {
            params: {
                filtro: JSON.stringify(filters.filter),
                pageNumber: filters.pageNumber,
                pageSize: filters.pageSize
            },
        });
    }

    getCeEvaluacionEtapa5All(filters: TablePaginatorSearch, Id: number): Observable<any> {
        return this.http.get<ResponseV1<PageResultV1<CicloEvaDTOV1[]>>>(environment.api.concat('/CfgCicloEvaluacion/GetCeIndicadoresEtapa5All'), {
            params: {
                filtro: JSON.stringify(filters.filter),
                pageNumber: filters.pageNumber,
                pageSize: filters.pageSize,
                cicloEvaluacionId: Id
            },
        });
    }

    getCeEtapa6CampusVw1(filters: TablePaginatorSearch): Observable<any> {
        return this.http.get<ResponseV1<PageResultV1<CicloEvaDTOV1[]>>>(environment.api.concat('/CfgCicloEvaluacion/GetCeEtapa6CampusVw1'), {
            params: {
                filtro: JSON.stringify(filters.filter),
                pageNumber: filters.pageNumber,
                pageSize: filters.pageSize
            },
        });
    }

    getCeEtapa6CampusVw1RI(filters: TablePaginatorSearch): Observable<any> {
        return this.http.get<ResponseV1<PageResultV1<CicloEvaDTOV1[]>>>(environment.api.concat('/CfgCicloEvaluacion/GetCeEtapa6CampusVw1Ri'), {
            params: {
                filtro: JSON.stringify(filters.filter),
                pageNumber: filters.pageNumber,
                pageSize: filters.pageSize
            },
        });
    }

    getCeEtapa6ECampusVw1(filters: TablePaginatorSearch): Observable<any> {
        return this.http.get<ResponseV1<PageResultV1<CicloEvaDTOV1[]>>>(environment.api.concat('/CfgCicloEvaluacion/GetCeEtapa6ECampusVw1'), {
            params: {
                filtro: JSON.stringify(filters.filter),
                pageNumber: filters.pageNumber,
                pageSize: filters.pageSize
            },
        });
    }

    //ETAPA 6 PM DISEÑO DECISIÓN
    getCeIndicadoresEtapa6PMD(filters: TablePaginatorSearch): Observable<any> {
        return this.http.get<ResponseV1<PageResultV1<CicloEvaDTOV1[]>>>(environment.api.concat('/CfgCicloEvaluacion/GetCeIndicadoresEtapa6PMD'), {
            params: {
                filtro: JSON.stringify(filters.filter),
                pageNumber: filters.pageNumber,
                pageSize: filters.pageSize
            },
        });
    }

    //ETAPA 6 PM EJECUCIÓN
    getCeIndicadoresEtapa6ExecutionRI(filters: TablePaginatorSearch): Observable<any> {
        return this.http.get<ResponseV1<PageResultV1<CicloEvaDTOV1[]>>>(environment.api.concat('/CfgCicloEvaluacion/GetCeIndicadoresEtapa6PMERI'), {
            params: {
                filtro: JSON.stringify(filters.filter),
                pageNumber: filters.pageNumber,
                pageSize: filters.pageSize
            },
        });
    }

    getCeIndicadoresEtapa6PME(filters: TablePaginatorSearch): Observable<any> {
        return this.http.get<ResponseV1<PageResultV1<CicloEvaDTOV1[]>>>(environment.api.concat('/CfgCicloEvaluacion/GetCeIndicadoresEtapa6PME'), {
            params: {
                filtro: JSON.stringify(filters.filter),
                pageNumber: filters.pageNumber,
                pageSize: filters.pageSize
            },
        });
    }

    getCeEtapa6CampusDepAreaVw1(filters: TablePaginatorSearch): Observable<any> {
        return this.http.get<ResponseV1<PageResultV1<CicloEvaDTOV1[]>>>(environment.api.concat('/CfgCicloEvaluacion/GetCeEtapa6CampusDepAreaVw1'), {
            params: {
                filtro: JSON.stringify(filters.filter),
                pageNumber: filters.pageNumber,
                pageSize: filters.pageSize
            },
        });
    }
    

    getCeEvaluacionAll(filters: TablePaginatorSearch, Id: number): Observable<ResponseV1<PageResultV1<CicloCeEvaluacionAll[]>>> {
        return this.http.get<ResponseV1<PageResultV1<CicloCeEvaluacionAll[]>>>(environment.api.concat('/CfgCicloEvaluacion/GetCeEvaluacionAll'), {
            params: {
                filtro: JSON.stringify(filters.filter),
                pageNumber: filters.pageNumber,
                pageSize: filters.pageSize,
                cicloEvaluacionId: Id
            },
        });
    }

    getCeEvaluacionWithParams(filters: TablePaginatorSearch, Id: number): Observable<ResponseV1<PageResultV1<CicloEvaDTOV1[]>>> {
        return this.http.get<ResponseV1<PageResultV1<CicloEvaDTOV1[]>>>(environment.api.concat('/CfgCicloEvaluacion/GetCeEvaluacionWithParameters'), {
            params: {
                filtro: JSON.stringify(filters.filter),
                pageNumber: filters.pageNumber,
                pageSize: filters.pageSize,
                cicloEvaluacionId: Id 
            },
        });
    }

    getCeEvaluacionE7RiWithParams(filters: TablePaginatorSearch): Observable<ResponseV1<PageResultV1<CicloEvaDTOV1[]>>> {
        return this.http.get<ResponseV1<PageResultV1<CicloEvaDTOV1[]>>>(environment.api.concat('/CfgCicloEvaluacion/GetCeEvaluacionE7RiWithParameters'), {
            params: {
                filtro: JSON.stringify(filters.filter),
                pageNumber: filters.pageNumber,
                pageSize: filters.pageSize,
                //cicloEvaluacionId: Id 
            },
        });
    }

    getGetCeDataGoalParameters(filters: TablePaginatorSearch, Id: number): Observable<any> {
        return this.http.get<ResponseV1<PageResultV1<CicloEvaDTOV1[]>>>(environment.api.concat('/CfgCicloEvaluacion/GetCeDataGoalParameters'), {
            params: {
                filtro: JSON.stringify(filters.filter),
                pageNumber: filters.pageNumber,
                pageSize: filters.pageSize,
                cicloEvaluacionId: Id 
            },
        });
    }
    

    getAllExcel(filters: TablePaginatorSearch, Id: number) {
        return this.http.get(environment.api.concat('/CfgCicloEvaluacion/ExcelDescarga'), {
            params: {
                filtro: JSON.stringify(filters.filter),
                pageNumber: filters.pageNumber,
                pageSize: filters.pageSize,
                cicloEvaluacionId: Id,
            },
            responseType: 'blob',
        });
    }

    getReporteSugerenciaSiacExcel(filters: TablePaginatorSearch) {
        return this.http.get(environment.api.concat('/CfgCicloEvaluacion/GetEtapa6PMDEReporteSugerenciaSIAC'), {
            params: {
                filtro: JSON.stringify(filters.filter),
            },
            responseType: 'blob',
            observe: 'response' // simply add this option
        });
    }

    disableCEEvaluacion(id: number, disable: boolean): Observable<ResponseV1<never>> {
        return this.http.patch<ResponseV1<never>>(environment.api.concat(`/CfgCicloEvaluacion/DisableCeEvaluacion`), {
            id: id,
            activo: disable,
        });
    }

    getEstatusEtapa(etapaId: number): Observable<any> 
    {
        let output = this.obtenerEstatus();
        let filtered = output.filter(x => x.etapaId == etapaId)
        return of(filtered);
    }

    GetAzureFile(archivoAzureId: number){
        return this.http.get(environment.api.concat(`/AzureStorage/Download/${archivoAzureId}/formato-plan-mejora`), {
            responseType: 'blob',
        });
    }

    GetAzureFileByIdFile(archivoAzureId: number,containerName : string){
        return this.http.get(environment.api.concat(`/AzureStorage/Download/${archivoAzureId}/${containerName}`), {
            responseType: 'blob',
        });
    }




    

    obtenerEstatus()
    {
    
    let json = 
    [
        // {"EtapaId":1,"EstatusId":1,"Descripcion":"Pendiente","estatusfinal":false},
        // {"EtapaId":1,"EstatusId":2,"Descripcion":"Capturada","estatusfinal":true},
        {"etapaId":1,"estatusId":3,"descripcion":"N\/A en revisión","estatusfinal":false},
        {"etapaId":1,"estatusId":4,"descripcion":"N\/A no autorizado","estatusfinal":false},
        {"etapaId":1,"estatusId":5,"descripcion":"N\/A autorizado","estatusfinal":true},
        // {"EtapaId":2,"EstatusId":1,"Descripcion":"Pendiente","estatusfinal":false},
        // {"EtapaId":2,"EstatusId":2,"Descripcion":"Cargada","estatusfinal":false},
        // {"EtapaId":2,"EstatusId":3,"Descripcion":"No aceptada","estatusfinal":false},
        // {"EtapaId":2,"EstatusId":4,"Descripcion":"Aceptada","estatusfinal":true},
        {"etapaId":2,"estatusId":5,"descripcion":"N\/A en revisión","estatusfinal":false},
        {"etapaId":2,"estatusId":6,"descripcion":"N\/A no autorizado","estatusfinal":false},
        {"etapaId":2,"estatusId":7,"descripcion":"N\/A autorizado","estatusfinal":true},
        // {"EtapaId":3,"EstatusId":1,"Descripcion":"Pendiente","estatusfinal":false},
        // {"EtapaId":3,"EstatusId":2,"Descripcion":"Capturada","estatusfinal":true},
        {"etapaId":3,"estatusId":3,"descripcion":"N\/A en revisión","estatusfinal":false},
        {"etapaId":3,"estatusId":4,"descripcion":"N\/A no autorizado","estatusfinal":false},
        {"etapaId":3,"estatusId":5,"descripcion":"N\/A autorizado","estatusfinal":true},
        // {"etapaId":4,"estatusId":1,"descripcion":"Pendiente","estatusfinal":false},
        // {"etapaId":4,"estatusId":2,"descripcion":"Capturada","estatusfinal":true},
        {"etapaId":4,"estatusId":3,"descripcion":"N\/A en revisión","estatusfinal":false},
        {"etapaId":4,"estatusId":4,"descripcion":"N\/A no autorizado","estatusfinal":false},
        {"etapaId":4,"estatusId":5,"descripcion":"N\/A autorizado","estatusfinal":true},
        // {"etapaId":5,"estatusId":1,"descripcion":"Pendiente","estatusfinal":false},
        // {"etapaId":5,"estatusId":2,"descripcion":"Revisada","estatusfinal":true},
        {"etapaId":5,"estatusId":3,"descripcion":"N\/A en revisión","estatusfinal":false},
        {"etapaId":5,"estatusId":4,"descripcion":"N\/A no autorizado","estatusfinal":false},
        {"etapaId":5,"estatusId":5,"descripcion":"N\/A autorizado","estatusfinal":true},
        {"etapaId":6,"estatusId":11,"descripcion":"Pendiente de carga","estatusfinal":false},
        {"etapaId":6,"estatusId":12,"descripcion":"Pendiente de revisión","estatusfinal":false},
        {"etapaId":6,"estatusId":13,"descripcion":"Autorizado","estatusfinal":true},
        {"etapaId":6,"estatusId":14,"descripcion":"No autorizado","estatusfinal":false},
        {"etapaId":6,"estatusId":21,"descripcion":"Pendiente","estatusfinal":false},
        {"etapaId":6,"estatusId":22,"descripcion":"Decisión tomada","estatusfinal":true},
        {"etapaId":6,"estatusId":23,"descripcion":"No se realiza - En Revisión","estatusfinal":false},
        {"etapaId":6,"estatusId":24,"descripcion":"No se realiza - Autorizado","estatusfinal":true},
        {"etapaId":6,"estatusId":25,"descripcion":"No se realiza -  No Autorizado","estatusfinal":false},
        {"etapaId":6,"estatusId":26,"descripcion":"No requerida","estatusfinal":true},
    ]

    let table = json.map((dato: any) => new CeEstatusDto().deserialize(dato))
    return table
    }



    obtenerDatosDeStorageCicloEvaluacion(): any {
        let datoStorage = JSON.parse(localStorage.getItem('cycleStage'));
        if (datoStorage[0]) {
          if (datoStorage[0].etapaEvaluacion) {
            if (datoStorage[0].etapaEvaluacion.length > 0) {
              datoStorage[0].fechaInicio = datoStorage[0].etapaEvaluacion[0].fechaInicio;
              datoStorage[0].fechaFin = datoStorage[0].etapaEvaluacion[0].fechaFin;
            }
          }
        }
        return datoStorage[0];
    }

    configuraParametros = (events: any, htmlInputSearch : any) => {
        
        let parametrosConfigurados  = new CeIndicadoresEtapasParamsModel();
        if (events.NombreCampus) {
          parametrosConfigurados.campusIds = events.NombreCampus;
        }
    
        if (events.NombreArea) {
          parametrosConfigurados.areaResponsableIds = events.NombreArea;
        }
    
        if (events.IndicadorTipoResultado) {
          parametrosConfigurados.indicadorTipoResultado = events.IndicadorTipoResultado[0];
        }
    
        if (events.NivelModalidad) {
          parametrosConfigurados.nivelModalidadIds = events.NivelModalidad;
        }
    
        if (events.Avance) {
          parametrosConfigurados.avanceCompleto = events.Avance == 100 ? true : false;
        }
    
        if (events.EstatusCaptura) {
          parametrosConfigurados.estatusEtapaIds = events.EstatusCaptura;
        }
    
        if (events.SubAreaCentral) {
          parametrosConfigurados.subAreaCentralIds = events.SubAreaCentral;
        }
    
        let textoBusqueda = null;
        if (htmlInputSearch.nativeElement) {
          textoBusqueda = htmlInputSearch.nativeElement.value.trim()
        }
    
        let campus = parametrosConfigurados.campusIds != undefined;
        let areaResp = parametrosConfigurados.areaResponsableIds != undefined;
        let subAreaC = parametrosConfigurados.subAreaCentralIds != undefined;
        let nivelMod = parametrosConfigurados.nivelModalidadIds != undefined;
        let estatus = parametrosConfigurados.estatusEtapaIds != undefined;
        //campus
        let avance = parametrosConfigurados.avanceCompleto != undefined;
        let tipo = parametrosConfigurados.indicadorTipoResultado != undefined;
    
        return { parametrosConfigurados,campus, areaResp,subAreaC,nivelMod,estatus,avance,tipo}
      }
    
      
}




export class CicloEvaluacionIndicadoresEtapasBaseModel {
    cicloEvaluacionId: number | null;
    campusId: number | null;
    areaResponsableId: number | null;
    indicadorId: number | null;
    procesoEvaluacionId: number | null;
    usuarioId: number | null;
    etapaId: number | null;
    ceevaluacionId: number | null;
    nivelModalidadId: number | null;
    nivelModalidadDescripcion: string | null;
    solicitaNa: boolean | null;
    justificacionNa: string | null;
    autorizaNa: boolean | null;
    comentAutorizaNa: string | null;
    estatusEtapa: number | null;
    estatusDescripcion: string | null;
    estatusfinal: boolean | null;
}

export class CicloEvaluacionIndicadoresEtapaModel extends CicloEvaluacionIndicadoresEtapasBaseModel 
{
    cEEtapa1MetasID: number | null;
    metaAnterior: number | null;
    decisionAnterior: number | null;
    decisionAnteriorNombre: string | null;
    metaInstitucional: number | null;
    metaActual: number | null;
}

export class DatosDeFiltro
{
    filtros: any | null;
    campusIds: number[] | null;
    areaResponsableIds: number | null;
    subAreaCentralIds: number[] | null;
    nivelModalidadIds: number[] | null;
    estatusEtapaIds: boolean | null;
    avanceCompleto: number[] | null;
    indicadorTipoResultado: number[] | null;
}


export class CeIndicadoresEtapasParamsModel {
    campusIds: number[] | null;
    areaResponsableIds: number[] | null;
    indicadorTipoResultado: number | null;
    nivelModalidadIds: number[] | null;
    subAreaCentralIds: number[] | null;
    avanceCompleto: boolean | null;
    estatusEtapaIds: number[] | null;
  }

export class CeEstatusDto 
{
    etapaId: number; // Primary key, representing the stage ID.
    estatusId: number; // Primary key, representing the status ID.
    descripcion: string | null; // Description of the status.
    estatusfinal: boolean | null; // Indicates if this status is the final status.

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}
