import { Deserializable } from '../interfaces';

export class SubareaCentralDTO implements Deserializable{
    id: number;
    nombre: string;
    siglas: string;
    activo: boolean;
    areaCentralId: number;

    constructor() {
        this.id = null;
        this.nombre = null;
        this.siglas = null;
        this.activo = null;
        this.areaCentralId = null;
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}