import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Response, ResponseV1 } from 'src/app/utils/interfaces';
import { CopiadoRequest, CopiadoResult, PageResult, RolProcesoDTO, TablePaginatorSearch, Perfil } from 'src/app/utils/models';
import { PermisosRolesVistasDTO } from 'src/app/utils/models/permisos-roles-vistas';
import { UsuarioRolProcesoDTOV2 } from 'src/app/utils/models/usuario-rol-procesoV2.dto';
import { CatalogoRolesDTO } from 'src/app/utils/models/catalogo-roles-dto';
import { PageResultV1 } from 'src/app/utils/models/';
import { environment } from 'src/environments/environment';
import { RolPermisosDTO } from 'src/app/utils/models/rol-permisos.dto';
import { Auth } from 'src/app/utils/helpers';

@Injectable({ providedIn: 'root' })
export class RolesService {
  rolProcessList: RolProcesoDTO[];
  usuarioRolProcesoList : UsuarioRolProcesoDTOV2[];
  userSession: Perfil;

  constructor(private http: HttpClient) {
    this.rolProcessList = [];
    this.usuarioRolProcesoList = [];
    this.userSession = new Perfil();

    this.updateSessionInfo();
  }

  updateSessionInfo(): void
    {
        let sessionValues = Auth.getSession();
        if (sessionValues != null){
            this.userSession = Auth.getSession()
        }
    }

  getAllRoles(filters: TablePaginatorSearch): Observable<ResponseV1<PageResultV1<CatalogoRolesDTO[]>>> {
    return this.http.get<ResponseV1<PageResultV1<CatalogoRolesDTO[]>>>(
        environment.api.concat('/AuthRol/GetCatalogoRoles'),
        {
            params: {
                filtro: JSON.stringify(filters.filter),
                pageSize: filters.pageSize,
                pageNumber: filters.pageNumber,
            },
        }
    );
  }

  getAllRolesExcel(filters: TablePaginatorSearch) {
    return this.http.get(environment.api.concat('/AuthRol/ExcelDescarga'), {
        params: {
            filtro: JSON.stringify(filters.filter),
        },
        responseType: 'blob',
    });
}

  updateRol(body: RolPermisosDTO): Observable<ResponseV1<never>> {
    return this.http.put<ResponseV1<never>>(environment.api.concat('/AuthRol/UpdateRolVistaPermiso'), body);
  }

  disableRol(id: number, disable: boolean): Observable<ResponseV1<never>> {
    return this.http.patch<never>(environment.api.concat(`/AuthRol/Disable`), {
        id: id,
        activo: disable,
    });
}

  creaRolVistaPermiso(body: RolPermisosDTO): Observable<Response<never>> {
    return this.http.post<Response<never>>(environment.api.concat('/AuthRol/Add'), body);
  }

  getRolProcesoById(filters: TablePaginatorSearch, usuarioId: number ): Observable<ResponseV1<PageResult<UsuarioRolProcesoDTOV2[]>>> {
    return this.http.get<ResponseV1<PageResult<UsuarioRolProcesoDTOV2[]>>>(environment.api.concat('/AuthRol/GetRolProcesoById'), {
      params: {
        pageSize: filters.pageSize,
        pageNumber: filters.pageNumber,
        filtro: JSON.stringify(filters.filter),
        usuarioId: usuarioId

      },
    });
  }

  getCatalogoRolById(rolId: number ): Observable<ResponseV1<PageResult<CatalogoRolesDTO[]>>> {
    return this.http.get<ResponseV1<PageResult<CatalogoRolesDTO[]>>>(environment.api.concat('/AuthRol/GetCatalogoRolbyId'), {
      params: {
        rolId: rolId

      },
    });
  }

  getMPermisosVistaRol(rolId: number ): Observable<ResponseV1<PageResult<PermisosRolesVistasDTO[]>>> {
    return this.http.get<ResponseV1<PageResult<PermisosRolesVistasDTO[]>>>(environment.api.concat('/UsuarioPermisos/GetMPermisosVistaRol'), {
      params: {
        rolId: rolId

      },
    });
  }

  getAllRolProcess(filters: TablePaginatorSearch, process: string): Observable<Response<PageResult<RolProcesoDTO[]>>> {
    return this.http.get<Response<PageResult<RolProcesoDTO[]>>>(environment.api.concat('/api/RolProceso'), {
      params: {
        proceso: process,
        pageSize: filters.pageSize,
        pageNumber: filters.pageNumber,
        ordenar: filters.orderBy,
        dir: filters.dir,
      },
    });
  }

  createRolProcess(body: RolProcesoDTO): Observable<Response<never>> {
    return this.http.post<Response<never>>(environment.api.concat('/api/RolProceso'), body);
  }

  updateRolProcess(body: RolProcesoDTO): Observable<Response<never>> {
    return this.http.put<Response<never>>(environment.api.concat('/api/RolProceso'), body);
  }

  deleteRolProcess(rolProcessId: string, process: number): Observable<Response<never>> {
    return this.http.delete<Response<never>>(environment.api.concat(`/api/RolProceso/${rolProcessId}`), {
      params: {
        proceso: process,
      },
    });
  }

  copyRolProcess(body: CopiadoRequest): Observable<Response<CopiadoResult>> {
    return this.http.post<Response<CopiadoResult>>(environment.api.concat('/api/RolProceso/copiar'), body);
  }

  async setAllRolProcessList(process: string): Promise<void> {
    const filters = new TablePaginatorSearch();
    filters.inactives = true;
    filters.pageSize = -1;
    filters.pageNumber = 1;

    return new Promise((resolve) => {
      this.getAllRolProcess(filters, process).subscribe((response) => {
        if (response.data.data) {
          const data = response.data.data.map((item) => new RolProcesoDTO().deserialize(item));
          this.rolProcessList = data;
        }
        resolve();
      });
    });
  }


  


}
