import { Deserializable } from '../interfaces';

export class DetailsIndicatorAllNormativeDTOV1 implements Deserializable {
    id: number
    clave: string
    nombre: string
    activo: boolean
    fechaCreacion: string
    usuarioCreacion: number
    fechaModificacion: any
    usuarioModificacion: any
    tblIndicadoresNormativa: any[]


    constructor() {
        this.id = null;
        this.clave = null;
        this.nombre = null;
        this.activo = null;
        this.fechaCreacion = null;
        this.usuarioCreacion = null;
        this.fechaModificacion = null;
        this.usuarioModificacion = null;
        this.tblIndicadoresNormativa = [];

    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}
