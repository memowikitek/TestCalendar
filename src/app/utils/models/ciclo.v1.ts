import { Deserializable } from '../interfaces';

export class CicloV1 implements Deserializable {
    id: string | number;
    nombre: string;
    activo: boolean;
    fechaCreacion: Date | string;
    usuarioModificacion: number;
    fechaModificacion: Date | string;
    usuarioCreacion: number;

    constructor() {
        this.id = null;
        this.nombre = null;
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
