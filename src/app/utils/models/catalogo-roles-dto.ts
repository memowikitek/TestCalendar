import { Deserializable } from '../interfaces';
import { TipoRolDTO } from './tipo-rol.dto'
import { PermisoPorVistaDTO } from './permisos-por-vista.dto';


export class CatalogoRolesDTO implements Deserializable {
    id: number;
    nombre: string;
    activo: boolean;
    isAllAreas: boolean;
    tipoRolId: number;
    nombreTipoRol: string;
    fechaCreacion: Date | string;
    usuarioCreacion: number;
    fechaModificacion: Date | string;
    usuarioModificacion: number;
    permisos: PermisoPorVistaDTO[] = []

    constructor(){
        this.id = null;
        this.nombre = null;
        this.activo = null;
        this.isAllAreas = null;
        this.tipoRolId = null;
        this.nombreTipoRol = null;
        this.fechaCreacion = null;
        this.usuarioCreacion = null;
        this.fechaModificacion = null;
        this.usuarioModificacion = null;
        this.permisos = []
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}