import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
    PageResult,
    PageResultV1,
    PerfilDTO,
    PerfilDTOV1,
    PerfilAddUpdateDTOV1,
    TablePaginatorSearch,
    ModulesCatalog,
} from 'src/app/utils/models';
import { Observable } from 'rxjs';
import { FileResponse, Response, ResponseV1 } from 'src/app/utils/interfaces';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class ProfileService {
    profileList: PerfilDTOV1[];
    headers: any;
    constructor(private http: HttpClient) {
        this.profileList = [];
        this.headers = new Headers({
            'Content-Type': 'application/json',
        });
    }

    getAllModules(): Observable<ResponseV1<ModulesCatalog>> {
        return this.http.get<ResponseV1<ModulesCatalog>>(environment.api.concat(`/UsuariosPermisos/GetModulos`));
    }

    getAllProfiles(filters: TablePaginatorSearch): Observable<ResponseV1<PageResultV1<PerfilDTOV1[]>>> {
        return this.http.get<ResponseV1<PageResultV1<PerfilDTOV1[]>>>(environment.api.concat('/Perfil/GetAll'), {
            params: {
                filtro: JSON.stringify(filters.filter),
                pageSize: filters.pageSize,
                pageNumber: filters.pageNumber,
            },
        });
    }

    getProfileById(perfilId: string | number): Observable<Response<PerfilDTOV1>> {
        return this.http.get<Response<PerfilDTOV1>>(environment.api.concat(`/Perfil/GetById?id=${perfilId}`));
    }

    createProfile(body: PerfilDTOV1): Observable<Response<never>> {
        return this.http.post<Response<never>>(environment.api.concat('/Perfil/Add'), body);
    }

    updateProfile(body: PerfilDTOV1): Observable<Response<never>> {
        return this.http.put<Response<never>>(environment.api.concat('/Perfil/Update'), body);
    }

    disableProfile(id: number, disable: boolean): Observable<ResponseV1<never>> {
        return this.http.patch<never>(environment.api.concat(`/Perfil/Disable`), {
            id: id,
            activo: disable,
        });
    }

    deleteProfile(perfilId: number): Observable<ResponseV1<never>> {
        return this.http.delete<never>(environment.api.concat(`/Perfil/Delete?id=${perfilId}`));
    }

    getAllProfilesExcel(filters: TablePaginatorSearch) {
        return this.http.get(environment.api.concat('/Perfil/ExcelDescarga'), {
            params: {
                filtro: JSON.stringify(filters.filter),
            },
            responseType: 'blob',
        });
    }

    async setAllProfiles(): Promise<void> {
        const filters = new TablePaginatorSearch();
        filters.inactives = true;
        filters.pageSize = -1;
        filters.pageNumber = 1;

        return new Promise((resolve) => {
            this.getAllProfiles(filters).subscribe((response) => {
                if (response.output) {
                    const data = response.output.map((item) => new PerfilDTOV1().deserialize(item));
                    this.profileList = data.filter((item) => item.activo === true);
                }
                resolve();
            });
        });
    }
}
