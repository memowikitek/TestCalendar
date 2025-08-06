import { Deserializable } from '../interfaces';

export class AuditDTOV1 implements Deserializable {
    id: number;
    nombre: string;
    totalIndicadores: number;
    activo: boolean;
    fechaCreacion: Date | string;
    usuarioCreacion: number | null;
    usuarioModificacion: number | null;
    constructor() {
        this.id = null;
        this.nombre = null;
        this.totalIndicadores = null;
        this.activo = null;
        this.usuarioCreacion = null;
        this.usuarioModificacion = null;
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}
