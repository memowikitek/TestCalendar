import { Deserializable } from '../interfaces';
export class ComponenteDTOV1 implements Deserializable {
    id: number;
    clave: string;
    nombre: string;
    activo: boolean;
    fechaCreacion: Date | string;
    usuarioModificacion: number;
    fechaModificacion: Date | string;
    usuarioCreacion: number;
    elementosEvaluacion: number[];
    strElementosEvaluacion: string;

    constructor() {
        this.id = null;
        this.clave = null;
        this.nombre = null;
        this.activo = null;
        this.fechaCreacion = null;
        this.usuarioCreacion = null;
        this.fechaModificacion = null;
        this.usuarioModificacion = null;
        this.strElementosEvaluacion = null;
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}
