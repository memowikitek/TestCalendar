import { Deserializable } from '../interfaces';

export class PageResults implements Deserializable {
    pagina: number;
    registros: number;
    paginas: number;
    count: number;

    constructor() {
        this.pagina = null;
        this.paginas = null;
        this.registros = null;
        this.count = null;
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}
