import { matPaginatorDefaultOptions } from '../helpers';
import { Deserializable } from '../interfaces';

export class TablePaginatorSearch implements Deserializable {
    pageSize: number;
    pageNumber: number;
    orderBy: string;
    dir: string;
    filter: any;
    search: string;
    inactives: boolean;

    constructor() {
        this.pageSize = 5;
        this.pageNumber = 0;
        this.orderBy = '';
        this.dir = '';
        this.filter = null;
        this.search = '';
        this.inactives = true;
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}
