import { Deserializable } from '../interfaces';

export class PermisosRolesVistasDTO implements Deserializable {
    
    vistaId : number;
    rolId: number;
    url : string | null;
    permisos : string | null;

    constructor() {
        this.vistaId = null;
        this.rolId = null;
        this.url = null;
        this.permisos = null;
        
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }

   
}
