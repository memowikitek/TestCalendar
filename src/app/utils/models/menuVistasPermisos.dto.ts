import { Deserializable } from '../interfaces';
import { VistaPermisoDTO } from 'src/app/utils/models'

export class MenuVistasPermisosDTO implements Deserializable {
    id: number;
    nombre: string;    
    activo: boolean;
    vistaPadre: number;
    subMenus: MenuVistasPermisosDTO[]
    permisos: VistaPermisoDTO[]

    constructor() {
        this.id = null;
        this.nombre = null;
        this.activo = null;
        this.vistaPadre = null;
        this.subMenus = null;
        this.permisos = null;
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}
 