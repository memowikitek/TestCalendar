import { Deserializable } from '../interfaces';

export class TipoAccesoDTOV1 implements Deserializable {
    id: number;
    nombre: string;
    descripcion: string;
    activo: boolean;
    fechaCreacion: Date | string;
    usuarioModificacion: number;
    fechaModificacion: Date | string;
    usuarioCreacion: number;

    constructor() {
        this.id = null;
        this.nombre = null;
        this.descripcion = null;
        this.activo = null;
        this.fechaCreacion = null;
        this.usuarioCreacion = null;
        this.fechaModificacion = null;
        this.usuarioModificacion = null
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}
