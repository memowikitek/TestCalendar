import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Auth } from 'src/app/utils/helpers';
import { FileResponse, Response, ResponseV1 } from 'src/app/utils/interfaces';
import {
    CatalogoUsuarioDTOV1,
    PageResultV1,
    Perfil,
    TablePaginatorSearch,
    UsuarioAddUpdateDTOV1,
    UsuarioDTO,
    UsuarioDTOV1,
} from 'src/app/utils/models';
import { PermisosDTO } from 'src/app/utils/models/permisos.dto';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class UsersService {
    permissions: PermisosDTO[];
    userSession: Perfil;
    userCatalogList: UsuarioDTO[];

    constructor(private http: HttpClient) {
        this.permissions = [];
        this.userSession = new Perfil();
        this.userCatalogList = [];
        this.updateSessionInfo();
    }

    updateSessionInfo(): void
    {
        let sessionValues = Auth.getSession();
        if (sessionValues != null){
            this.userSession = Auth.getSession()
        }
    }

    get permissionList(): PermisosDTO[] {
        return this.permissions;
    }

    getAllUsers(filters: TablePaginatorSearch): Observable<ResponseV1<PageResultV1<CatalogoUsuarioDTOV1[]>>> {
        return this.http.get<ResponseV1<PageResultV1<CatalogoUsuarioDTOV1[]>>>(
            environment.api.concat('/Usuario/GetAll'),
            {
                params: {
                    filtro: JSON.stringify(filters.filter),
                    pageSize: filters.pageSize,
                    pageNumber: filters.pageNumber,
                },
            }
        );
    }

    searchUser(email: string): Observable<ResponseV1<CatalogoUsuarioDTOV1>> {
        return this.http.get<ResponseV1<never>>(environment.api.concat(`/Usuario/ExisteCuenta?correo=${email}`));
    }

    getUserDataById(userId: number): Observable<ResponseV1<CatalogoUsuarioDTOV1>> {
        return this.http.get<ResponseV1<CatalogoUsuarioDTOV1>>(environment.api.concat(`/Usuario/GetById?id=${userId}`));
    }

    getUserProfilePermissions(email: string): Observable<any> {
        return this.http.get<any>(environment.api.concat(`/UsuarioPermisos/GetAll?correo=${email}`));
    }

    getModulesDet(): Observable<any> {
        return this.http.get<any>(environment.api.concat(`/UsuarioPermisos/GetModulosDetalle`));
    }

    getUserById(userId: string | number): Observable<ResponseV1<CatalogoUsuarioDTOV1>> {
        return this.http.get<ResponseV1<CatalogoUsuarioDTOV1>>(
            environment.api.concat(`/Usuario/GetById?idUsuario=${userId}`)
        );
    }

    createUser(body: CatalogoUsuarioDTOV1): Observable<ResponseV1<never>> {
        return this.http.post<ResponseV1<never>>(environment.api.concat('/Usuario/Add'), body);
    }

    updateUser(body: CatalogoUsuarioDTOV1): Observable<ResponseV1<never>> {
        return this.http.put<ResponseV1<never>>(environment.api.concat('/Usuario/Update/'), body);
    }

    disableUser(id: number, disable: boolean): Observable<ResponseV1<never>> {
        return this.http.patch<never>(environment.api.concat(`/Usuario/Disable`), {
            id: id,
            activo: disable,
        });
    }

    deleteUser(userId: string | number): Observable<ResponseV1<never>> {
        return this.http.delete<never>(environment.api.concat(`/Usuario/Delete?id=${userId}`));
    }

    getAllUsersExcel(filters: TablePaginatorSearch) {
        return this.http.get(environment.api.concat('/Usuario/ExcelDescarga'), {
            params: {
                filtro: JSON.stringify(filters.filter),
            },
            responseType: 'blob',
        });
    }

    async setAllUsers(): Promise<void> {
        const filters = new TablePaginatorSearch();
        const userFilter: UsuarioDTO = new UsuarioDTO();
        userFilter.activo = true;
        filters.filter = userFilter;
        filters.pageSize = 999999;
        filters.pageNumber = 1;
        await new Promise((resolve) => {
            this.getAllUsers(filters).subscribe((response) => {
                if (response.output) {
                    const data = response.output.map((area) => new UsuarioDTO().deserialize(area));
                    //this.userCatalogList = data.filter((item) => item.activo === true);
                }
                resolve(true);
            });
        });
    }
}
