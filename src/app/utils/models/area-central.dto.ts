import { Deserializable } from '../interfaces';

export class AreaCentralDTO implements Deserializable{
    id: number;
    nombre: string;
    siglas: string;
    activo: boolean;

    constructor() {
        this.id = null;
        this.nombre = null;
        this.siglas = null;
        this.activo = null;
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}