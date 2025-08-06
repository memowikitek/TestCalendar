import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FileResponse, Response, ResponseV1 } from 'src/app/utils/interfaces';
import { ComponenteMIDTOV1, PageResult, PageResultV1, TablePaginatorSearch } from 'src/app/utils/models';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class ComponentMiService {
    componentMiList: ComponenteMIDTOV1[];

    constructor(private http: HttpClient) {
        this.componentMiList = [];
    }

    getAllComponentMi(filters: TablePaginatorSearch): Observable<ResponseV1<PageResultV1<ComponenteMIDTOV1[]>>> {
        return this.http.get<ResponseV1<PageResultV1<ComponenteMIDTOV1[]>>>(
            environment.api.concat('/ComponentMI/GetAll'),
            {
                params: {
                    pageNumber: filters.pageNumber,
                    pageSize: filters.pageSize,
                    filtro: JSON.stringify(filters.filter),
                },
            }
        );
    }

    getComponentMiById(ComponentMIId: string | number): Observable<ResponseV1<ComponenteMIDTOV1>> {
        return this.http.get<ResponseV1<ComponenteMIDTOV1>>(
            environment.api.concat(`/ComponentMI/GetById?id=${ComponentMIId}`)
        );
    }

    createComponentMi(body: ComponenteMIDTOV1): Observable<ResponseV1<never>> {
        return this.http.post<ResponseV1<never>>(environment.api.concat('/ComponentMI/Add'), body);
    }

    updateComponentMi(body: ComponenteMIDTOV1): Observable<ResponseV1<never>> {
        return this.http.put<ResponseV1<never>>(environment.api.concat('/ComponentMI/Update'), body);
    }

    disableComponentMi(id: number, disable: boolean): Observable<ResponseV1<never>> {
        return this.http.patch<ResponseV1<never>>(environment.api.concat(`/ComponentMI/Disable`), {
            id: id,
            activo: disable,
        });
    }

    deleteComponentMi(ComponentMIId: string | number): Observable<ResponseV1<never>> {
        return this.http.delete<never>(environment.api.concat(`/ComponentMI/Delete?id=${ComponentMIId}`));
    }

    getAllComponentMiExcel(filters: TablePaginatorSearch) {
        return this.http.get(environment.api.concat('/ComponentMI/ExcelDescarga'), {
            params: {
                filtro: JSON.stringify(filters.filter),
            },
            responseType: 'blob',
        });
    }

    getUrlAllComponentMiExcel() {
        return environment.api.concat(`/Export/GetAll/ComponentMI`);
    }

    async setAllComponentMi(): Promise<void> {
        const filters = new TablePaginatorSearch();
        filters.filter = { activo: true };
        filters.pageSize = 100;
        filters.pageNumber = 0;

        return new Promise((resolve) => {
            this.getAllComponentMi(filters).subscribe((response) => {
                if (response.output) {
                    const data = response.output.map((item) => new ComponenteMIDTOV1().deserialize(item));
                    this.componentMiList = data.filter((item) => item.activo === true);
                }
                resolve();
            });
        });
    }
}
