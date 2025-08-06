import { PageResults } from '../models/page-results';

export interface Response<T> {
    statusCode: number;
    message: string;
    success: boolean;
    data: T;
    paginacion: PageResults;
}
