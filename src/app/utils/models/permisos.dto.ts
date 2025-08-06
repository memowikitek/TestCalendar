import { Deserializable } from '../interfaces';

export class PermisosDTO implements Deserializable {
    perfilId: number | null;
    perfil: string | null;
    vistaId: number | null;
    vista: string | null;
    vistaPadre: number | null;
    permisos: string | null;

    constructor() {
        this.perfilId = null;
        this.perfil = null;
        this.vistaId = null;
        this.vista = null;
        this.vistaPadre = null;
        this.permisos = null;
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}
