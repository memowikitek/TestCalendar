import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import {  ResponseV1 } from 'src/app/utils/interfaces';
import { IndicadoresDTO, IndicadoresDTOV1, TablePaginatorSearch,PageResultV1, PageResult } from 'src/app/utils/models';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';

export interface indicadorData {
  data: IndicadoresDTOV1;
}

@Injectable({
  providedIn: 'root'
})
export class IndicatorsService {
  private read = new BehaviorSubject<boolean>(false);
  currentReadState: any;

  constructor(private http: HttpClient, private dialog: MatDialog) {
    this.currentReadState = this.read.asObservable();
  }    

  //getAll(): Observable<ResponseV1<IndicadoresDTO>> 
  getAll(filters: TablePaginatorSearch): Observable<ResponseV1<PageResultV1<IndicadoresDTOV1[]>>> 
  {
    return this.http.get<ResponseV1<PageResultV1<IndicadoresDTOV1[]>>>(environment.api.concat('/CfgIndicadores/GetAll'), {
      params: {
          filtro: JSON.stringify(filters.filter),
          pageNumber: filters.pageNumber,
          pageSize: filters.pageSize,
      },
  });

  }


  getCategory(): Observable<any> {
    return this.http.get<any>(environment.api.concat(`/CfgIndicadores/GetCatalog`));
  }

  createIndicator(body: IndicadoresDTOV1): Observable<ResponseV1<never>> {
    return this.http.post<ResponseV1<never>>(environment.api.concat('/CfgIndicadores/Add'), body);
  }
//  getIndicadorById(IndicadorSiacId: number,ProcesoEvaluacionId: number, ComponenteId: number, ElementoEvaluacionId: number, AreaCentralId: number, SubAreaCentralId: number): Observable<ResponseV1<IndicadoresDTOV1>> {
  //  return this.http.get<ResponseV1<IndicadoresDTOV1>>(environment.api.concat(`/CfgIndicadores/GetById?IndicadorSiacId=${IndicadorSiacId}&ProcesoEvaluacionId=${ProcesoEvaluacionId}&ComponenteId=${ComponenteId}&ElementoEvaluacionId=${ElementoEvaluacionId}&AreaCentralId=${AreaCentralId}&SubAreaCentralId=${SubAreaCentralId}`));
 // }
 getIndicadorById(indicadorId: number): Observable<ResponseV1<IndicadoresDTOV1>> {
  return this.http.get<ResponseV1<IndicadoresDTOV1>>(environment.api.concat(`/CfgIndicadores/GetById?IndicadorSiacId=${indicadorId}`));
}

getIndicadorByIdCatalog(indicadorId: number): Observable<ResponseV1<IndicadoresDTOV1>> {
  return this.http.get<ResponseV1<IndicadoresDTOV1>>(environment.api.concat(`/CfgIndicadores/GetById?IndicadorId=${indicadorId}`));
}

  updateIndicador(body: IndicadoresDTOV1): Observable<ResponseV1<never>> {
    return this.http.put<ResponseV1<never>>(environment.api.concat('/CfgIndicadores/Update'), body);
  }

  updateIndicadorDetalle(body: IndicadoresDTOV1): Observable<ResponseV1<never>> {
    return this.http.put<ResponseV1<never>>(environment.api.concat('/CfgIndicadores/UpdateDetail'), body);
  }

  deleteIndicador(IndicadorId: number): Observable<ResponseV1<never>> {
    return this.http.delete<never>(environment.api.concat(`/CfgIndicadores/Delete/?IndicadorId=${IndicadorId}`));
}

getAllIndicadoresExcel(filters: TablePaginatorSearch) {
  return this.http.get(environment.api.concat('/CfgIndicadores/ExcelDescarga'), {
      params: {
          filtro: JSON.stringify(filters.filter),
      },
      responseType: 'blob',
  });
}

getCeIndicadorInfo(indicadorId: number, cicloEvaluacionId: number) {
  return this.http.get<ResponseV1<IndicadoresDTOV1>>(environment.api.concat(`/CfgIndicadores/GetCEIndicador?CicloEvaluacionId=${cicloEvaluacionId}&IndicadorId=${indicadorId}`));
}

updateCeIndicador(body: IndicadoresDTOV1): Observable<ResponseV1<never>> {
  return this.http.put<ResponseV1<never>>(environment.api.concat('/CfgIndicadores/UpdateCEIndicador'), body);
}

changeReadState(newState: boolean) {
  this.read.next(newState);
}

}

/*    let  resp  = {} as ResponseV1<IndicadoresDTO>;
    resp.exito=true;
    resp.output = this.onCreateDummyTable();
    return of(resp);*/


     //return this.http.get<ResponseV1<EvidenciasIndicadorCapturaDTO>>(environment.api.concat(`/api/MetasAreaResponsable/GetById?id=${configGralId}`));
///CfgIndicadores/GetAll
  //  }

/*
  onCreateDummyTable(): IndicadoresDTO[] {
  
    let tempList: IndicadoresDTO[];
  
    let temp1 = new IndicadoresDTO();
    temp1.ProcesoEvaluacionId = 1;
    temp1.ComponenteId = 1;
    temp1.ElementoEvaluacionId = 1;
    temp1.IndicadorSiacid = 1;
    temp1.AreaCentralId = 1;
    temp1.SubAreaCentralId = 1;
    temp1.Activo = true;
    temp1.FechaCreacion = "12-02-2024";
    temp1.UsuarioCreacion = 1;
    temp1.FechaModificacion = "12-02-2024";
    temp1.UsuarioModificacion = 1;
  
    
    tempList = [];
    tempList.push(temp1);
    return tempList;
    
  }
*/
///}


