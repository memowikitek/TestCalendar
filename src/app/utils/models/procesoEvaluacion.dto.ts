import { Deserializable } from '../interfaces';

export class ProcesoEvaluacionDTO implements Deserializable{
    id: number;
    nombre: string;
    totalIndicadores: number;
    activo: boolean;

    constructor() {
        this.id = null;
        this.nombre = null;
        this.totalIndicadores = null;
        this.activo = null;
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}