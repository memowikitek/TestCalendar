import { Deserializable } from '../interfaces';

export class RegionDTOV1 implements Deserializable {
    id: number;
    clave: string;
    nombre: string;
    directorRegionalId: number;
    directorRegional: string;
    activo: boolean;
    fechaCreacion: Date | string;
    usuarioCreacion: number;
    fechaModificacion: Date | string;
    usuarioModificacion: number;

    constructor() {
        this.id = null;
        this.clave = null;
        this.nombre = null;
        this.directorRegionalId = null;
        this.directorRegional = null;
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
