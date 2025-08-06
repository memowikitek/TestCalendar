import { Deserializable } from '../interfaces';

export class SubIndicadorMIDTO implements Deserializable {
    subIndicadorMiId: number;
    nombreSubIndicadorMi: string;
    activo: boolean;
    fechaCreacion: string;
    usuarioCreacion: number;
    fechaModificacion: string;
    usuarioModificacion: number;

    constructor() {
        this.subIndicadorMiId = 0;
        this.nombreSubIndicadorMi = null;
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
