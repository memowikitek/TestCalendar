import { Deserializable } from '../interfaces';

export class CicloV2DTO implements Deserializable {
    id: number;
    nombre: string;

    constructor() {
        this.id = null;
        this.nombre = null;
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}
