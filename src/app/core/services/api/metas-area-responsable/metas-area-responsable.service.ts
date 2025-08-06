import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { FileResponse, Response, ResponseV1 } from 'src/app/utils/interfaces';
import { ConfiguracionGeneral } from 'src/app/utils/models/configuracion-general';
import { MetasIndicadoresCapturaDTO } from 'src/app/utils/models/metas-indicadores-captura-dto';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class MetasAreaResponsableService {
    constructor(private http: HttpClient) {}

    getMetasAreaResponsableById(
        cfgGeneralId: number | null,
        metasAreaResponsableId: number | null,
        areaResponsableId: number | null,
        idproceso: number | null
    ): Observable<ResponseV1<MetasIndicadoresCapturaDTO>> {
        let MetaFilter = `/MetasAreaResponsable/GetById?idProceso=${idproceso}&cfgGeneralId=${cfgGeneralId}&areaResponsableId=${areaResponsableId}&metasAreaResponsableId=${
            metasAreaResponsableId ?? ''
        }`;
        return this.http.get<ResponseV1<MetasIndicadoresCapturaDTO>>(environment.api.concat(MetaFilter));
    }

    addMetasAreaResponsable(metasIndicadoresCaptura: any): Observable<ResponseV1<MetasIndicadoresCapturaDTO>> {
        return this.http.post<ResponseV1<never>>(
            environment.api.concat(`/MetasAreaResponsable/Add`),
            metasIndicadoresCaptura
        );
    }
}
