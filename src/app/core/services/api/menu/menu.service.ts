import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseV1 } from 'src/app/utils/interfaces';
import { PageResultV1, TablePaginatorSearch } from 'src/app/utils/models';
import { MenuDTO } from 'src/app/utils/models/menu.dto';
import { environment } from 'src/environments/environment';
import { MenuVistasPermisosDTO } from 'src/app/utils/models'

@Injectable({ providedIn: 'root' })
export class MenuService {
    constructor(private http: HttpClient) {}

    getAllMenus(filters: TablePaginatorSearch): Observable<ResponseV1<PageResultV1<MenuDTO[]>>> {
       
        var data = this.http.get<ResponseV1<PageResultV1<MenuDTO[]>>>(environment.api.concat('/Menu/GetAll'), {
            params: {
                filtro: JSON.stringify(filters.filter),
                pageSize: filters.pageSize,
                pageNumber: filters.pageNumber,
            },
        });
        return data;
    }

    getAllMenusVista(filters: TablePaginatorSearch): Observable<ResponseV1<PageResultV1<MenuDTO[]>>> {
       
        var data = this.http.get<ResponseV1<PageResultV1<MenuDTO[]>>>(environment.api.concat('/Menu/GetMenuVistas'), {
            params: {
                filtro: JSON.stringify(filters.filter),
                pageSize: filters.pageSize,
                pageNumber: filters.pageNumber,
            },
        });

        return data;
    }

    getAllMenusVistaPermisos(filters: TablePaginatorSearch): Observable<ResponseV1<PageResultV1<MenuVistasPermisosDTO[]>>> {
       
        var data = this.http.get<ResponseV1<PageResultV1<MenuVistasPermisosDTO[]>>>(environment.api.concat('/Menu/GetMenuVistasPermisos'), {
            params: {
                filtro: JSON.stringify(filters.filter),
                pageSize: filters.pageSize,
                pageNumber: filters.pageNumber,
            },
        });

        return data;
    }

    getMenusByRolId(rolId: number): Observable<ResponseV1<PageResultV1<MenuDTO[]>>> {
        
        var data = this.http.get<ResponseV1<PageResultV1<MenuDTO[]>>>(environment.api.concat('/Menu/GetMenuByRolId'), {
            params: {
                rolId: rolId,
            },
        });

        console.log('data service:' + JSON.stringify(data));

        return data;
    }
}
