import { Deserializable } from '../interfaces';

export class RubricaEvaluacionDTOV1 implements Deserializable {
    id: number;
    anio: number;
    cicloId: number;
    ciclo: string;
    activo: boolean;
    fechaCreacion: Date | string;
    usuarioModificacion: number;
    fechaModificacion: Date | string;
    usuarioCreacion: number;

    constructor() {
        this.id = null;
        this.anio = null;
        this.cicloId = null;
        this.ciclo = null;
        this.activo = null;
        this.fechaCreacion = null;
        this.usuarioCreacion = null;
        this.fechaModificacion = null;
        this.usuarioModificacion = null;
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}
