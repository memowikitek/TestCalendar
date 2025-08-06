import { Deserializable } from '../interfaces';
import { PermisosDTO } from './permisos.dto';

export class PerfilDTOV1 implements Deserializable {
    id: number;
    nombre: string;
    administrador: boolean;
    evaluador: boolean;
    autorizador: boolean;
    otro: boolean;
    activo: boolean;
    permisos: PermisosDTO[];
    fechaCreacion: Date | string;
    usuarioCreacion: number;
    fechaModificacion: Date | string;
    usuarioModificacion: number;

    constructor() {
        this.id = null;
        this.nombre = null;
        this.administrador = false;
        this.evaluador = false;
        this.autorizador = false;
        this.otro = false;
        this.activo = false;
        this.permisos = [];
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
