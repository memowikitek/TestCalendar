import { Deserializable } from '../interfaces';

export class ComponenteMIDTO implements Deserializable {
    componenteMiId: number;
    nombreComponenteMi: string;
    descripcionComponenteMi: string;
    activo: boolean;

    constructor() {
        this.componenteMiId = 0;
        this.nombreComponenteMi = null;
        this.descripcionComponenteMi = null;
        this.activo = null;
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}
