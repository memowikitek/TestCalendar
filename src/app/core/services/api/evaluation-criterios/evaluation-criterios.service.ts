import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FileResponse, ResponseV1 } from 'src/app/utils/interfaces';
import { CriteriosEvaluacionRecordDTO, PageResultV1, TablePaginatorSearch } from 'src/app/utils/models';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })

export class EvaluationCriteriosService {

  constructor(private http: HttpClient, private dialog: MatDialog) { }

  getAllCriterios(IdCE: any, IdE: any): Observable<any> {
    return this.http.get<any>(environment.api.concat(`/CriteriosEvaluacionRI/GetAllCriterios?CicloEvaluacionId=${IdCE}&EtapaId=${IdE}`));
  }

  getStatusRI(): Observable<any> {
    return this.http.get<any>(environment.api.concat('/StatusRI/GetAll'));
  }

  // AddUpdate
  addUpdateCeEtapa7(body: CriteriosEvaluacionRecordDTO): Observable<ResponseV1<never>> {
    return this.http.post<ResponseV1<never>>(environment.api.concat('/CriteriosEvaluacionRI/AddUpdateceeEtapa7Ri'), body);
  }

  // Respuesta ///CriteriosEvaluacionRI/GceeEtapa7RiRespuestas
  postRespCeEtapa7(body: CriteriosEvaluacionRecordDTO): Observable<ResponseV1<never>> {
    return this.http.post<ResponseV1<never>>(environment.api.concat('/CriteriosEvaluacionRI/GceeEtapa7RiRespuestas'), body);
  }

  // AddUpdate
  addUpdateCeEtapa7ToEtapa2(body: CriteriosEvaluacionRecordDTO): Observable<ResponseV1<never>> {
    return this.http.post<ResponseV1<never>>(environment.api.concat('/CriteriosEvaluacionRI/AddUpdateceeEtapa7ToEtapa2Ri'), body);
  }

  // Respuesta ///CriteriosEvaluacionRI/GceeEtapa7RiRespuestas
  postRespCeEtapa7ToEtapa2(body: CriteriosEvaluacionRecordDTO): Observable<ResponseV1<never>> {
    return this.http.post<ResponseV1<never>>(environment.api.concat('/CriteriosEvaluacionRI/GceeEtapa7ToEtapa2RiRespuestas'), body);
  }

}
