import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FileResponse, ResponseV1 } from 'src/app/utils/interfaces';
import { InstitucionDTOV1, PageResultV1, TablePaginatorSearch } from 'src/app/utils/models';
import { environment } from 'src/environments/environment';

@Injectable()
export class InstitutionService {
    institutionList: InstitucionDTOV1[];
    constructor(private readonly http: HttpClient) {
        this.institutionList = [];
    }

    getAllInstitutions(filters: TablePaginatorSearch): Observable<ResponseV1<InstitucionDTOV1[]>> {
        return this.http.get<ResponseV1<InstitucionDTOV1[]>>(environment.api.concat('/CatInstitucion/GetAll'), {
            params: {
                pageNumber: filters.pageNumber,
                pageSize: filters.pageSize,
                filtro: JSON.stringify(filters.filter),
            },
        });
    }

    getInstitutionById(InstitutionId: string | number): Observable<ResponseV1<InstitucionDTOV1>> {
        return this.http.get<ResponseV1<InstitucionDTOV1>>(
            environment.api.concat(`/CatInstitucion/GetById?id=${InstitutionId}`)
        );
    }

    createInstitution(body: InstitucionDTOV1): Observable<ResponseV1<never>> {
        return this.http.post<ResponseV1<never>>(environment.api.concat('/CatInstitucion/Add'), body);
    }

    updateInstitution(body: InstitucionDTOV1): Observable<ResponseV1<never>> {
        return this.http.put<ResponseV1<never>>(environment.api.concat('/CatInstitucion/Update'), body);
    }

    disableInstitution(id: number, disable: boolean): Observable<ResponseV1<never>> {
        return this.http.patch<ResponseV1<never>>(environment.api.concat(`/CatInstitucion/Disable`), {
            id: id,
            activo: disable,
        });
    }

    deleteInstitution(InstitutionId: string | number): Observable<ResponseV1<never>> {
        return this.http.delete<never>(environment.api.concat(`/CatInstitucion/Delete/?id=${InstitutionId}`));
    }

    getAllInstitutionsExcel(filters: TablePaginatorSearch) {
        return this.http.get(environment.api.concat('/CatInstitucion/ExcelDescarga'), {
            params: {
                filtro: JSON.stringify(filters.filter),
            },
            responseType: 'blob',
        });
    }

    getUrlAllInstitutionsExcel() {
        return environment.api.concat(`/Export/GetAll/Institution`);
    }
}
