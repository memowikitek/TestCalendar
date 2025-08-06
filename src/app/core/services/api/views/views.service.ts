import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseV1 } from 'src/app/utils/interfaces';
import { ModulesCatalog, PageResultV1 } from 'src/app/utils/models';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class ViewsService {
    constructor(private readonly http: HttpClient) {}

    getAllViews(): Observable<ResponseV1<PageResultV1<ModulesCatalog[]>>> {
        return this.http.get<ResponseV1<PageResultV1<ModulesCatalog[]>>>(
            environment.api.concat('/UsuarioPermisos/GetModulosDetalle')
        );
    }

    getAllModules(): Observable<ResponseV1<PageResultV1<ModulesCatalog[]>>> {
        return this.http.get<ResponseV1<PageResultV1<ModulesCatalog[]>>>(
            environment.api.concat('/UsuarioPermisos/GetModulos')
        );
    }
}
