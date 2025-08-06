import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Response, ResponseV1 } from 'src/app/utils/interfaces';
import { CopiadoRequest, CopiadoResult, PageResult, RolProcesoDTO, TablePaginatorSearch } from 'src/app/utils/models';
import { PermisosRolesVistasDTO } from 'src/app/utils/models/permisos-roles-vistas';
import { UsuarioRolProcesoDTOV2 } from 'src/app/utils/models/usuario-rol-procesoV2.dto';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })

export class RolesProcesosService {

  constructor(private http: HttpClient) { }

  getRolProcesoById(filters: TablePaginatorSearch, usuarioId: number): Observable<ResponseV1<PageResult<UsuarioRolProcesoDTOV2[]>>> {
    return this.http.get<ResponseV1<PageResult<UsuarioRolProcesoDTOV2[]>>>(environment.api.concat('/AuthRol/GetRolProcesoById'), {
      params: {
        pageSize: filters.pageSize,
        pageNumber: filters.pageNumber,
        filtro: JSON.stringify(filters.filter),
        usuarioId: usuarioId
      },
    });
  }
}
