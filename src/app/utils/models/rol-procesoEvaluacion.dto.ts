import { Deserializable } from '../interfaces';

export class RolProcesoEvaluacionDTO implements Deserializable{
    id: number;
    nombre: string;
    tipoRolId: number;
    activo: boolean;

    constructor() {
        this.id = null;
        this.nombre = null;
        this.tipoRolId = null;
        this.activo = null;
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}