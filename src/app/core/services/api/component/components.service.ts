import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FileResponse, Response, ResponseV1 } from 'src/app/utils/interfaces';
import { ComponenteDTO, ComponenteDTOV1, PageResult, PageResultV1, TablePaginatorSearch } from 'src/app/utils/models';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class ComponentsService {
    componentsList: ComponenteDTOV1[];

    constructor(private http: HttpClient) {
        this.componentsList = [];
    }

    getAllComponents(filters: TablePaginatorSearch): Observable<ResponseV1<PageResultV1<ComponenteDTOV1[]>>> {
        return this.http.get<ResponseV1<PageResultV1<ComponenteDTOV1[]>>>(
            environment.api.concat('/CatComponente/GetAll'),
            {
                params: {
                    filtro: JSON.stringify(filters.filter),
                    pageSize: filters.pageSize,
                    pageNumber: filters.pageNumber,
                },
            }
        );
    }

    getComponentsById(compoonentsId: string): Observable<ResponseV1<ComponenteDTOV1>> {
        return this.http.get<ResponseV1<ComponenteDTOV1>>(
            environment.api.concat(`/CatComponente/Componente/${compoonentsId}`)
        );
    }

    createComponent(body: ComponenteDTOV1): Observable<ResponseV1<never>> {
        return this.http.post<ResponseV1<never>>(environment.api.concat('/CatComponente/Add'), body);
    }

    updateComponent(body: ComponenteDTOV1): Observable<ResponseV1<never>> {
        return this.http.put<ResponseV1<never>>(environment.api.concat('/CatComponente/Update'), body);
    }

    disableComponent(id: number, disable: boolean): Observable<ResponseV1<never>> {
        return this.http.patch<ResponseV1<never>>(environment.api.concat(`/CatComponente/Disable`), {
            id: id,
            activo: disable,
        });
    }

    deleteComponent(componentsId: number): Observable<ResponseV1<never>> {
        return this.http.delete<ResponseV1<never>>(environment.api.concat(`/CatComponente/Delete?id=${componentsId}`));
    }

    getAllComponentsExcel(filters: TablePaginatorSearch) {
        return this.http.get(environment.api.concat('/CatComponente/ExcelDescarga'), {
            params: {
                filtro: JSON.stringify(filters.filter),
            },
            responseType: 'blob',
        });
    }

    getUrlAllComponentsExcel() {
        return environment.api.concat(`/Export/GetAll/Componente`);
    }

    async setAllComponents(): Promise<void> {
        const filters = new TablePaginatorSearch();
        filters.inactives = true;
        filters.pageSize = 1;
        filters.pageNumber = 1;

        return new Promise((resolve) => {
            this.getAllComponents(filters).subscribe((response) => {
                if (response.output) {
                    const data = response.output.map((item) => new ComponenteDTOV1().deserialize(item));
                    this.componentsList = data.filter((item) => item.activo === true);
                }
                resolve();
            });
        });
    }
}
