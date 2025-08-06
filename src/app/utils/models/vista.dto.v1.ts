import { Deserializable } from '../interfaces';

export class VistaDTOV1 implements Deserializable {
    idVista: string | number;
    nombre: string;
    idTipoVista: string | number;
    tipoVista: string;
    fechaCreacion: Date | string;
    usuarioModificacion: number;
    fechaModificacion: Date | string;
    usuarioCreacion: number;

    constructor() {
        this.idVista = null;
        this.nombre = null;
        this.idTipoVista = null;
        this.tipoVista = null;
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
