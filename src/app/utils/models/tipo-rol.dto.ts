import { Deserializable } from '../interfaces';

export class TipoRolDTO implements Deserializable{
    id: number;
    nombre: string;
    activo: boolean;

    constructor() {
        this.id = null;
        this.nombre = null;
        this.activo = null;
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}