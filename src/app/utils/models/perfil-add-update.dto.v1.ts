import { Deserializable } from '../interfaces';
import { PermisosDTO } from './permisos.dto';

export class PerfilAddUpdateDTOV1 implements Deserializable {
    id: number;
    clave: string;
    nombre: string;
    apellidos: string;
    correo: string;
    activo: boolean;
    permisos: PermisosDTO[];
    fechaCreacion: Date | string;
    usuarioCreacion: number;
    fechaModificacion: Date | string;
    usuarioModificacion: number;

    constructor() {
        this.id = null;
        this.nombre = null;
        this.clave = null;
        this.apellidos = null;
        this.correo = null;
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
