import { Deserializable } from '../interfaces';

export class SubAreaCorporativaDTOV1 implements Deserializable {
    id: number;
    siglas: string;
    nombre: string;
    areaCentralId: number;
    areaCentral: string;
    areaCentralSiglas: string;
    activo: boolean;
    fechaCreacion: Date | string;
    usuarioModificacion: number;
    fechaModificacion: Date | string;
    usuarioCreacion: number;

    constructor() {
        this.id = null;
        this.siglas = null;
        this.nombre = null;
        this.areaCentral = null;
        this.areaCentral = null;
        this.areaCentralSiglas = null;
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
