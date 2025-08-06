import { Deserializable } from '../interfaces';

export class Ciclo implements Deserializable {
    cicloId: number;
    nombre: string;

    constructor() {
        this.cicloId = null;
        this.nombre = null;
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}
