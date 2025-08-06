import { Deserializable } from '../interfaces';

export class PermisosHeredadosDTO implements Deserializable {
    vistaPadre: string | null;
    vistaHijo: string | null;

    constructor() {
        this.vistaPadre = null;
        this.vistaHijo = null;
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}
