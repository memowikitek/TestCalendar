import { Deserializable } from '../interfaces';
import { PermisosDTO } from './permisos.dto';

export class UsuarioPermisosDTO implements Deserializable {
    id: number | null;
    nombre: string | null;
    apellidos: string | null;
    nombreUsuario: string | null;
    correo: string | null;
    perfilId: number | null;
    perfil: string | null;
    campusId: number | null;
    campusClave: string | null;
    campus: string | null;
    regionId: number | null;
    regionClave: string | null;
    region: string | null;
    areaResponsableId: number | null;
    areaResponsable: string | null;
    vistas: PermisosDTO[];

    constructor() {
        this.id = null;
        this.nombre = null;
        this.apellidos = null;
        this.nombreUsuario = null;
        this.correo = null;
        this.perfilId = null;
        this.perfil = null;
        this.campusId = null;
        this.campusClave = null;
        this.campus = null;
        this.regionId = null;
        this.regionClave = null;
        this.region = null;
        this.areaResponsableId = null;
        this.areaResponsable = null;
        this.vistas = [];
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}
