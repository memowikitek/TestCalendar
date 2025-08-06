import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ResponseV1 } from 'src/app/utils/interfaces';
import { DetailsIndicatorNormativaDTOV1, DetailsCeIndicatorNormativaDTOV1, TablePaginatorSearch, PageResultV1, PageResult, DetailsIndicatorDTOV1, NormativaDTO, NormativaDTOV1, EvidenceDTO, AresponsableDTO, DetailsCEIndicatorEvidenciaDTOV1, ComponenteCEMIDTO, CEMisionDTO } from 'src/app/utils/models';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { RubricasDTOV1 } from 'src/app/utils/models/rubricas-v1.dto';
import { CeRubricasDTOV1 } from 'src/app/utils/models/detalles-ce-rubricas-v1.dto';
import { DetailsIndicatorEvidenciaDTOV1 } from 'src/app/utils/models/detalles-indicador-evidencia.dto';
import { DetailsIndicatorAllNormativeDTOV1 } from 'src/app/utils/models/detailsAllNormative.dto';
import { DetailsIndicatorAllEvidencesDTOV1 } from 'src/app/utils/models/detailsAllEvidence.dto';
//import { Normativa } from 'src/app/utils/interfaces/normativa';
import { MisionDTO } from 'src/app/utils/models/mision.dto';
import { DetailsCeIndicatorLectura } from 'src/app/utils/models/detalles-ce-indicador-lectura.dto';

export interface indicadorData {
  data: DetailsIndicatorNormativaDTOV1;
}

export interface rubricaData {
  data: RubricasDTOV1;
}

@Injectable({
  providedIn: 'root'
})

export class DetailsIndicatorsService {
  private indLeerSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public indLeer: boolean;
  currentReadState: any;

  constructor(private http: HttpClient, private dialog: MatDialog) {
    const { origin } = window.location;
  }

  getNormatives(filtro: any): Observable<ResponseV1<PageResultV1<DetailsIndicatorNormativaDTOV1[]>>> {
    return this.http.get<ResponseV1<PageResultV1<DetailsIndicatorNormativaDTOV1[]>>>(environment.api.concat('/CatNormativa/GetNormativaIndicadores'), {
      params: {
        filtro: JSON.stringify(filtro),
      }
    });
  }

  getCENormatives(filtro: any): Observable<ResponseV1<PageResultV1<DetailsCeIndicatorNormativaDTOV1[]>>> {
    return this.http.get<ResponseV1<PageResultV1<DetailsCeIndicatorNormativaDTOV1[]>>>(environment.api.concat('/CatNormativa/GetCeNormativaIndicadores'), {
      params: {
        filtro: JSON.stringify(filtro),
      }
    });
  }
  getAllNormatives(filters: TablePaginatorSearch): Observable<ResponseV1<PageResultV1<DetailsIndicatorAllNormativeDTOV1[]>>> {
    return this.http.get<ResponseV1<PageResultV1<DetailsIndicatorAllNormativeDTOV1[]>>>(environment.api.concat('/CatNormativa/GetAll'), {
      params: {
        filtro: JSON.stringify(filters.filter),
        pageSize: filters.pageSize,
        pageNumber: filters.pageNumber,
      },
    }
    );
  }

  getAddNormatives(body: any): Observable<ResponseV1<any>> {
    return this.http.post<ResponseV1<any>>(environment.api.concat('/CatNormativa/AddNormativaIndicadores'), body);
  }

  getAddCeNormatives(body: any): Observable<ResponseV1<any>> {
    return this.http.post<ResponseV1<any>>(environment.api.concat('/CatNormativa/AddCEIndicadoresNormativa'), body);
  }

  deleteNormative(body: DetailsIndicatorNormativaDTOV1): Observable<ResponseV1<any>> {
    return this.http.delete<any>(environment.api.concat(`/CatNormativa/DeleteNormativaIndicadores/`), { body });
  }

  deleteCeNormative(body: DetailsCeIndicatorNormativaDTOV1): Observable<ResponseV1<any>> {
    return this.http.delete<any>(environment.api.concat(`/CatNormativa/DeleteCEIndicadoresNormativa/`), { body });
  }

  deleteEvidencia(body: DetailsIndicatorEvidenciaDTOV1): Observable<ResponseV1<any>> {
    return this.http.delete<any>(environment.api.concat(`/CatEvidencia/DeleteIndicadoresEvidencia/`), { body });
  }

  deleteCeEvidencia(body: DetailsCEIndicatorEvidenciaDTOV1): Observable<ResponseV1<any>> {
    return this.http.delete<any>(environment.api.concat(`/CatEvidencia/DeleteCEIndicadoresEvidencia/`), { body });
  }

  deleteMision(body: MisionDTO): Observable<ResponseV1<any>> {
    return this.http.delete<any>(environment.api.concat(`/CfgIndicadoresMisionInstitucional/Delete/`), { body });
  }

  deleteCeMision(body: ComponenteCEMIDTO): Observable<ResponseV1<any>> {
    return this.http.delete<any>(environment.api.concat(`/CfgCEIndicadoresMatrizMI/Delete/`), { body });
  }

  deleteAreaResp(body: AresponsableDTO): Observable<ResponseV1<any>> {
    return this.http.delete<any>(environment.api.concat(`/CatAreaResponsable/DeleteIndicadoresAreaResponsable/`), { body });
  }

  deleteRubrica(body: RubricasDTOV1): Observable<ResponseV1<any>> {
    return this.http.delete<any>(environment.api.concat(`/CatEscalasRubrica/DeleteIndicadoresEscalaRubrica/`), { body });
  }

  deleteCeRubrica(body: CeRubricasDTOV1): Observable<ResponseV1<any>> {
    return this.http.delete<any>(environment.api.concat(`/CatEscalasRubrica/DeleteCEIndicadoresEscalaRubrica/`), { body });
  }

  getEvidences(filtro: any): Observable<ResponseV1<PageResultV1<DetailsIndicatorEvidenciaDTOV1[]>>> {
    return this.http.get<ResponseV1<PageResultV1<DetailsIndicatorEvidenciaDTOV1[]>>>(environment.api.concat('/CatEvidencia/GetEvidenciaIndicadores'), {
      params: {
        filtro: JSON.stringify(filtro),
      }
    });
  }
  getCEEvidences(filtro: any): Observable<ResponseV1<PageResultV1<DetailsCEIndicatorEvidenciaDTOV1[]>>> {
    return this.http.get<ResponseV1<PageResultV1<DetailsCEIndicatorEvidenciaDTOV1[]>>>(environment.api.concat('/CatEvidencia/GetCEEvidenciaIndicadores'), {
      params: {
        filtro: JSON.stringify(filtro),
      }
    });
  }
  getAllEvidences(filters: TablePaginatorSearch): Observable<ResponseV1<PageResultV1<DetailsIndicatorAllEvidencesDTOV1[]>>> {
    return this.http.get<ResponseV1<PageResultV1<DetailsIndicatorAllEvidencesDTOV1[]>>>(environment.api.concat('/CatEvidencia/GetAll'), {
      params: {
        filtro: JSON.stringify(filters.filter),
        pageSize: filters.pageSize,
        pageNumber: filters.pageNumber,
      }
    });
  }
  getAddEvidencias(body: any): Observable<ResponseV1<any>> {
    return this.http.post<ResponseV1<any>>(environment.api.concat('/CatEvidencia/AddEvidenciaIndicadores'), body);
  }
  getAddCeEvidencias(body: any): Observable<ResponseV1<any>> {
    return this.http.post<ResponseV1<any>>(environment.api.concat('/CatEvidencia/AddCEIndicadoresEvidencia'), body);
  }


  getAreas(filtro: any): Observable<ResponseV1<PageResultV1<DetailsIndicatorEvidenciaDTOV1[]>>> {
    return this.http.get<ResponseV1<PageResultV1<DetailsIndicatorEvidenciaDTOV1[]>>>(environment.api.concat('/CatAreaResponsable/GetIndicadoresAreaResponsable'), {
      params: {
        filtro: JSON.stringify(filtro),
      }
    });
  }


  getAllMision(filtro: any): Observable<ResponseV1<PageResultV1<MisionDTO[]>>> {
    return this.http.get<ResponseV1<PageResultV1<MisionDTO[]>>>(environment.api.concat('/CfgIndicadoresMisionInstitucional/GetAll'), {
      params: {
        filtro: JSON.stringify(filtro),
      }
    });
  }

  getAllCeIndicadoresMision(filtro: any): Observable<ResponseV1<PageResultV1<ComponenteCEMIDTO[]>>> {
    return this.http.get<ResponseV1<PageResultV1<ComponenteCEMIDTO[]>>>(environment.api.concat('/CfgIndicadoresMisionInstitucional/GetCEIndicadoresMisionInstitucional'), {
      params: {
        filtro: JSON.stringify(filtro),
      }
    });
  }

  getAddMision(body: any): Observable<ResponseV1<never>> {
    return this.http.post<ResponseV1<never>>(environment.api.concat('/CfgIndicadoresMisionInstitucional/Add'), body);
  }

  getAddCeMision(body: any): Observable<ResponseV1<never>> {
    console.table(body)
    return this.http.post<ResponseV1<never>>(environment.api.concat('/CfgCEIndicadoresMatrizMI/Add'), body);
  }

  getAddAResponsable(body: any): Observable<ResponseV1<any>> {
    return this.http.post<ResponseV1<any>>(environment.api.concat('/CatAreaResponsable/AddIndicadoresAreaResponsable'), body);
  }

  /*****************COMPONENTE MI*************************************************************** */
  getComponentMI(filters: TablePaginatorSearch): Observable<any> {
    return this.http.get<any>(environment.api.concat('/ComponentMI/GetAll'), {
      params: {
        pageSize: filters.pageSize,
        pageNumber: filters.pageNumber,
        filtro: JSON.stringify(filters.filter),
      },
    });
  }

  /******************************************************************************** */

  /*****************INDICADOR MI*************************************************************** */
  getIndicatortMI(): Observable<any> {
    return this.http.get<any>(environment.api.concat('/IndicadorMI/GetAll'), {
    });
  }

  /******************************************************************************** */

  /*****************SUB INDICADOR MI*************************************************************** */
  getSubIndicatortMI(): Observable<any> {
    return this.http.get<any>(environment.api.concat('/SubIndicadorMI/GetAll'), {
    });
  }

  /******************************************************************************** */


  /*****************INSTITUCION*************************************************************** */
  getInstitucion(filters: TablePaginatorSearch): Observable<any> {
    return this.http.get<any>(environment.api.concat('/CatInstitucion/GetAll'), {
      params: {
        pageSize: filters.pageSize,
        pageNumber: filters.pageNumber,
        filtro: JSON.stringify(filters.filter),
      },
    });
  }

  /******************************************************************************** */

  /*****************AR*************************************************************** */
  //AREA RESPONSABLE / CLAVE
  getAR(): Observable<any> {
    return this.http.get<any>(environment.api.concat('/CatAreaResponsable/GetAll'), {});
  }
  //TIPO DE RESULTADO
  getTipoResultado(): Observable<any> {
    return this.http.get<any>(origin + '/assets/data/tipoRespuesta.json');
  }
  //NIVEL / MODALIDAD
  getTipoNivel(filters: TablePaginatorSearch): Observable<any> {
    return this.http.get<any>(environment.api.concat('/CatNivelModalidad/GetAll'), {
      params: {
        pageSize: filters.pageSize,
        pageNumber: filters.pageNumber,
        filtro: JSON.stringify(filters.filter),
      },
    });
  }

  /******************************************************************************** */


  //Rúbricas
  getAllRubricaCatalog(): Observable<ResponseV1<PageResultV1<RubricasDTOV1[]>>> {

    //    return this.http.get<ResponseV1<PageResultV1<RubricasDTOV1[]>>>(environment.api.concat('/CatEscalasRubrica/GetIndicadoresEscalaRubrica'), {
    return this.http.get<ResponseV1<PageResultV1<RubricasDTOV1[]>>>(environment.api.concat('/CatEscalasRubrica/GetAll'), {
    });
  }
  getAllRubrica(): Observable<ResponseV1<PageResultV1<RubricasDTOV1[]>>> {

    return this.http.get<ResponseV1<PageResultV1<RubricasDTOV1[]>>>(environment.api.concat('/CatEscalasRubrica/GetIndicadoresEscalaRubrica'), {
      //      return this.http.get<ResponseV1<PageResultV1<RubricasDTOV1[]>>>(environment.api.concat('/CatEscalasRubrica/GetAll'), {
    });
  }

  getAllRubricaIndicadores(filters: TablePaginatorSearch): Observable<ResponseV1<PageResultV1<RubricasDTOV1[]>>> {
    return this.http.get<ResponseV1<PageResultV1<RubricasDTOV1[]>>>(environment.api.concat('/CatEscalasRubrica/GetIndicadoresEscalaRubrica'), {
      params: {
        pageSize: filters.pageSize,
        pageNumber: filters.pageNumber,
        filtro: JSON.stringify(filters.filter),
      }
      //      return this.http.get<ResponseV1<PageResultV1<RubricasDTOV1[]>>>(environment.api.concat('/CatEscalasRubrica/GetAll'), {
    });
  }

  getAllRubricaCeIndicadores(filters: TablePaginatorSearch): Observable<ResponseV1<PageResultV1<CeRubricasDTOV1[]>>> {
    return this.http.get<ResponseV1<PageResultV1<CeRubricasDTOV1[]>>>(environment.api.concat('/CatEscalasRubrica/GetCeIndicadoresEscalaRubrica'), {
      params: {
        pageSize: filters.pageSize,
        pageNumber: filters.pageNumber,
        filtro: JSON.stringify(filters.filter),
      }
      //      return this.http.get<ResponseV1<PageResultV1<RubricasDTOV1[]>>>(environment.api.concat('/CatEscalasRubrica/GetAll'), {
    });
  }


  getRubricasByIds(filtro: any): Observable<ResponseV1<PageResultV1<DetailsIndicatorNormativaDTOV1[]>>> {
    return this.http.get<ResponseV1<PageResultV1<DetailsIndicatorNormativaDTOV1[]>>>(environment.api.concat('/CatEscalasRubrica/GetIndicadoresEscalaRubricabyId'), {
      params: {
        filtro: JSON.stringify(filtro),
      }
    });
  }

  getRubricaUpdate(body: any): Observable<ResponseV1<PageResultV1<DetailsIndicatorNormativaDTOV1[]>>> {
    return this.http.post<ResponseV1<PageResultV1<DetailsIndicatorNormativaDTOV1[]>>>(environment.api.concat('/CatEscalasRubrica/UpdateIndicadoresEscalaRubrica'), body);
  }

  getCeRubricaUpdate(body: any): Observable<ResponseV1<PageResultV1<CeRubricasDTOV1[]>>> {
    return this.http.post<ResponseV1<PageResultV1<CeRubricasDTOV1[]>>>(environment.api.concat('/CatEscalasRubrica/UpdateCEIndicadoresEscalaRubrica'), body);
  }

  getAllRubricas(filters: TablePaginatorSearch): Observable<ResponseV1<PageResultV1<RubricasDTOV1[]>>> {
    return this.http.get<ResponseV1<PageResultV1<RubricasDTOV1[]>>>(environment.api.concat('/CatEscalasRubrica/GetIndicadoresEscalaRubrica'), {
      params: {
        filtro: JSON.stringify(filters.filter),
        pageNumber: filters.pageNumber,
        pageSize: filters.pageSize,
      },
    });
  }

  getEvidenciaID(filtro: any): Observable<ResponseV1<PageResultV1<EvidenceDTO[]>>> {
    return this.http.get<ResponseV1<PageResultV1<EvidenceDTO[]>>>(environment.api.concat('/CatEvidencia/GetAll'), {
      params: {
        filtro: JSON.stringify(filtro),
      }
    });
  }

  createRubrica(body: RubricasDTOV1): Observable<ResponseV1<never>> {
    return this.http.post<ResponseV1<never>>(environment.api.concat('/CatEscalasRubrica/AddIndicadoresEscalaRubrica'), body);
  }

  addCeRubrica(body: CeRubricasDTOV1): Observable<ResponseV1<never>> {
    return this.http.post<ResponseV1<never>>(environment.api.concat('/CatEscalasRubrica/AddCEIndicadoresEscalaRubrica'), body);
  }

  getPilarEstrategicoId(Id: number): Observable<ResponseV1<PageResultV1<any>>> {
    return this.http.get<ResponseV1<PageResultV1<RubricasDTOV1[]>>>(environment.api.concat(`/PilarEstrategicoMI/GetById?Id=${Id}`), {
    });
  }

  /*async downloadAzureStorageFile(id: number): Promise<ResponseV1<Blob>> {
    const response =  await this.http.get<ResponseV1<never>>(environment.api.concat(`/AzureStorage/Download/${id}/evidencias`)).toPromise();
    return response;
  }*/
  downloadAzureStorageFile(id: number) {
    return this.http.get(environment.api.concat(`/AzureStorage/Download/${id}/evidencias`), {
      responseType: 'blob',
    });
  }

  addLecturaIndicador(body: DetailsCeIndicatorLectura): Observable<ResponseV1<never>> {
    return this.http.post<ResponseV1<never>>(environment.api.concat('/CfgCicloEvaluacion/AddLecturaIndicador'), body);
  }

}
